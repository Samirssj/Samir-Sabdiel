import { Mail, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Correo Institucional",
      value: "s00057h@upla.edu.pe",
      link: "mailto:s00057h@upla.edu.pe"
    },
    {
      icon: <Mail className="h-4 w-4" />,
      label: "Correo Personal", 
      value: "samirrojas6042@gmail.com",
      link: "mailto:samirrojas6042@gmail.com"
    },
    {
      icon: <MapPin className="h-4 w-4" />,
      label: "Universidad",
      value: "Universidad Peruana Los Andes",
      link: "https://upla.edu.pe"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Año Académico",
      value: "2023 - En curso",
      link: null
    }
  ];

  const quickLinks = [
    { label: "Acerca de mí", id: "about" },
    { label: "Programas", id: "programs" },
    { label: "Trabajos", id: "works" },
    { label: "Inicio", id: "hero" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contact" className="bg-secondary/30 border-t-2 border-primary">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold text-gradient">
              Rojas Tamara Samir Sabdiel
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Estudiante de la Universidad Peruana Los Andes, enfocado en desarrollo de software 
              y compartir conocimiento académico a través de este blog personal.
            </p>
            <div className="flex items-center space-x-2 text-sm text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span>Disponible para colaboraciones académicas</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary">Enlaces Rápidos</h4>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-muted-foreground hover:text-primary transition-colors duration-200 text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary">Contacto</h4>
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {info.icon}
                    <span>{info.label}:</span>
                  </div>
                  {info.link ? (
                    <a 
                      href={info.link}
                      className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 flex items-center space-x-1"
                      target={info.link.startsWith('http') ? "_blank" : undefined}
                      rel={info.link.startsWith('http') ? "noopener noreferrer" : undefined}
                    >
                      <span>{info.value}</span>
                      {info.link.startsWith('http') && <ExternalLink className="h-3 w-3" />}
                    </a>
                  ) : (
                    <p className="text-sm text-foreground">{info.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/10 rounded-2xl p-6 mb-8 text-center">
          <h4 className="text-xl font-semibold text-primary mb-2">
            ¿Necesitas ayuda con algún proyecto?
          </h4>
          <p className="text-muted-foreground mb-4">
            Contacta conmigo para colaboraciones académicas o consultas sobre programación
          </p>
          <Button 
            asChild
            className="btn-primary-glow rounded-xl"
          >
            <a href="mailto:samirrojas6042@gmail.com">
              <Mail className="mr-2 h-4 w-4" />
              Enviar Email
            </a>
          </Button>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">
                © {currentYear} Rojas Tamara Samir Sabdiel. Todos los derechos reservados.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Blog Académico - Universidad Peruana Los Andes
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Hecho con 🖤 para compartir conocimiento</span>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Actualizado {currentYear}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;