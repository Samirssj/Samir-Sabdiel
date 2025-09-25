export const config = { runtime: 'edge' };

export default async function handler(req) {
  // CORS preflight support (useful when running from browser)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const json = (body, init = {}) =>
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      ...init,
    });

  if (req.method === 'GET') {
    // Endpoint simple para pruebas/listado (ajústalo si deseas listar desde Supabase)
    return json({ trabajos: [] });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();

      // Validación mínima
      const required = ['titulo', 'descripcion', 'categoria', 'curso', 'tipo', 'tecnologias'];
      const missing = required.filter((k) => body[k] == null || (typeof body[k] === 'string' && body[k].trim() === ''));
      if (missing.length) {
        return json({ success: false, error: `Datos inválidos: faltan ${missing.join(', ')}` }, { status: 400 });
      }

      const urlOk = (u) => {
        if (!u) return true;
        try { new URL(u); return true; } catch { return false; }
      };
      if (body.imagen_url && !urlOk(body.imagen_url)) {
        return json({ success: false, error: 'URL de imagen no válida' }, { status: 400 });
      }
      if (body.link_descarga && !urlOk(body.link_descarga)) {
        return json({ success: false, error: 'URL de descarga no válida' }, { status: 400 });
      }

      // Supabase client (usa variables ya presentes en tu .env/.env.example)
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        return json({ success: false, error: 'Faltan variables de entorno de Supabase' }, { status: 500 });
      }

      const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

      const payload = {
        titulo: body.titulo,
        descripcion: body.descripcion,
        categoria: body.categoria,
        curso: body.curso,
        tipo: body.tipo,
        tecnologias: Array.isArray(body.tecnologias) ? body.tecnologias : [],
        link_descarga: body.link_descarga || '#',
        imagen_url: body.imagen_url || null,
        fecha: body.fecha || new Date().toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('trabajos')
        .insert([payload])
        .select()
        .single();

      if (error) {
        return json({ success: false, error: 'Error al crear Trabajo', details: error.message }, { status: 500 });
      }

      return json({ success: true, message: 'Trabajo creado exitosamente', data }, { status: 201 });
    } catch (err) {
      return json({ success: false, error: 'Error procesando la solicitud', details: String(err) }, { status: 400 });
    }
  }

  return json({ success: false, error: 'Método no permitido' }, { status: 405 });
}