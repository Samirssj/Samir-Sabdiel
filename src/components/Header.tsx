import { useEffect, useState } from "react";
import { Menu, X, Home, User, Code2, Briefcase, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Inicio', id: 'hero', Icon: Home },
    { label: 'Acerca de mí', id: 'about', Icon: User },
    { label: 'Programas', id: 'programs', Icon: Code2 },
    { label: 'Trabajos', id: 'works', Icon: Briefcase },
    { label: 'Contacto', id: 'contact', Icon: Mail }
  ];

  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (y > lastY && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  return (
    <header className={`fixed top-0 w-full z-50 bg-transparent backdrop-blur-0 border-b-0 transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="text-xl font-bold text-gradient cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            RTS Blog 
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
                aria-label={label}
                title={label}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}

            {/* Admin Button */}
            <button
              onClick={() => window.location.href = '/admin/login'}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              aria-label="Admin"
              title="Admin"
            >
              <Shield className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-4">
              {navItems.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="p-2 rounded-md text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
              <button
                onClick={() => { window.location.href = '/admin/login'; setIsMenuOpen(false); }}
                className="p-2 rounded-md text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-label="Admin"
                title="Admin"
              >
                <Shield className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;