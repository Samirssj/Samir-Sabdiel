import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { siteSettingsService } from "@/services/api";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import TrabajoForm from "./components/admin/TrabajoForm";
import ProtectedRoute from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const GlobalAnimation = () => {
  const getModes = () => {
    if (typeof window === 'undefined') return [] as string[];
    const multi = localStorage.getItem('site_animations');
    if (multi) {
      try { return JSON.parse(multi) as string[]; } catch { /* ignore */ }
    }
    const legacy = localStorage.getItem('site_animation') || 'none';
    return legacy && legacy !== 'none' ? [legacy] : [];
  };
  const [modes, setModes] = useState<string[]>(getModes);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onStorage = () => setModes(getModes());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Apply CSS mode classes for non-canvas effects
  useEffect(() => {
    const root = document.documentElement;
    const map: Record<string, string> = {
      glitch: 'mode-glitch',
      shield: 'mode-shield',
    };
    // remove all known classes
    Object.values(map).forEach(c => root.classList.remove(c));
    // add active classes
    modes.forEach(m => { const c = map[m]; if (c) root.classList.add(c); });
  }, [modes]);

  // Supabase sync: initial fetch + realtime subscribe
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    (async () => {
      try {
        const res = await siteSettingsService.getAnimations();
        if (res.success && res.data) {
          const single = res.data.single || 'none';
          const combo = Array.isArray(res.data.combo) ? res.data.combo : [];
          localStorage.setItem('site_animation', single);
          localStorage.setItem('site_animations', JSON.stringify(combo));
          // refresh overlays in this tab
          window.dispatchEvent(new StorageEvent('storage', { key: 'site_animation', newValue: single }));
          window.dispatchEvent(new StorageEvent('storage', { key: 'site_animations', newValue: JSON.stringify(combo) }));
        }
      } catch {}
      unsubscribe = siteSettingsService.subscribeAnimations((val) => {
        const single = val.single || 'none';
        const combo = Array.isArray(val.combo) ? val.combo : [];
        localStorage.setItem('site_animation', single);
        localStorage.setItem('site_animations', JSON.stringify(combo));
        window.dispatchEvent(new StorageEvent('storage', { key: 'site_animation', newValue: single }));
        window.dispatchEvent(new StorageEvent('storage', { key: 'site_animations', newValue: JSON.stringify(combo) }));
      });
    })();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  useEffect(() => {
    const hasMatrix = modes.includes('matrix');
    if (!hasMatrix) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;
    let columns = Math.ceil((canvas.width / dpr) / fontSize);
    let drops = new Array(columns).fill(0).map(() => Math.floor(Math.random() * 50));
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      // soft fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(0,64,255,0.5)';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [modes]);

  const Scanlines = () => (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.06]"
      style={{
        backgroundImage: 'repeating-linear-gradient( to bottom, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 1px, transparent 2px, transparent 4px)'
      }}
      aria-hidden
    />
  );

  const Radar = () => (
    <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmin] h-[120vmin] rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, rgba(0,64,255,0.35) 0%, rgba(0,64,255,0.0) 60%)',
          animation: 'spin 18s linear infinite'
        }}
      />
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
  );

  const Nodes = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const mouse = useRef<{x:number;y:number}|null>(null);
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      window.addEventListener('resize', resize);

      const COUNT = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 18000));
      const pts = new Array(COUNT).fill(0).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
      const MAX_DIST = 120;

      const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
      const onLeave = () => { mouse.current = null; };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseleave', onLeave);

      const step = () => {
        const w = window.innerWidth, h = window.innerHeight;
        ctx.clearRect(0,0,w,h);
        // update
        for (const p of pts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        // draw connections
        for (let i=0;i<pts.length;i++) {
          for (let j=i+1;j<pts.length;j++) {
            const dx = pts[i].x - pts[j].x; const dy = pts[i].y - pts[j].y;
            const d = Math.hypot(dx,dy);
            if (d < MAX_DIST) {
              const a = 1 - d / MAX_DIST;
              ctx.strokeStyle = `rgba(0,64,255,${0.18 * a})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.stroke();
            }
          }
        }
        // draw points
        for (const p of pts) {
          let r = 1.4;
          if (mouse.current) {
            const dm = Math.hypot(p.x - mouse.current.x, p.y - mouse.current.y);
            if (dm < 100) r = 2.2;
          }
          ctx.fillStyle = 'rgba(0,64,255,0.8)';
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI*2); ctx.fill();
        }
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseleave', onLeave);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1] opacity-60" aria-hidden />;
  };

  const Particles = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      window.addEventListener('resize', resize);

      const COUNT = Math.min(80, Math.floor((window.innerWidth) / 20));
      const parts = new Array(COUNT).fill(0).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.8 + 0.6,
        vy: -(Math.random() * 0.6 + 0.2),
        vx: (Math.random() - 0.5) * 0.2,
        a: Math.random() * 0.4 + 0.3,
      }));

      const step = () => {
        const w = window.innerWidth, h = window.innerHeight;
        ctx.clearRect(0,0,w,h);
        for (const p of parts) {
          p.x += p.vx; p.y += p.vy;
          if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
          if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*4);
          grad.addColorStop(0, `rgba(0,64,255,${p.a})`);
          grad.addColorStop(1, 'rgba(0,64,255,0)');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        }
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
      return () => {
        window.removeEventListener('resize', resize);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, []);
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1] opacity-60" aria-hidden />;
  };

  return (
    <>
      {modes.includes('matrix') && (
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1] opacity-60" aria-hidden />
      )}
      {modes.includes('scanlines') && <Scanlines />}
      {modes.includes('radar') && <Radar />}
      {modes.includes('nodes') && <Nodes />}
      {modes.includes('particles') && <Particles />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="relative min-h-screen bg-background text-foreground">
        <GlobalAnimation />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/trabajos/new" 
              element={
                <ProtectedRoute>
                  <TrabajoForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/trabajos/:id/edit" 
              element={
                <ProtectedRoute>
                  <TrabajoForm />
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
