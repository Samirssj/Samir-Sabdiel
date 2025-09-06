import { Code, Database, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Programs = () => {
  const programs = [
    {
      title: "Java NetBeans",
      description: "Entorno de desarrollo integrado para Java. Perfecto para programación orientada a objetos, desarrollo de aplicaciones desktop y proyectos académicos.",
      icon: <Code className="h-8 w-8 text-primary" />,
      features: ["IDE Completo", "Debugging Avanzado", "Gestión de Proyectos"],
      downloadLink: "https://netbeans.apache.org/"
    },
    {
      title: "XAMPP & PHPMyAdmin",
      description: "Stack de desarrollo local que incluye Apache, MySQL, PHP y PHPMyAdmin. Ideal para desarrollo web y gestión de bases de datos.",
      icon: <Database className="h-8 w-8 text-primary" />,
      features: ["Servidor Local", "Gestión MySQL", "Desarrollo PHP"],
      downloadLink: "https://www.apachefriends.org/"
    },
    {
      title: "Visual Studio Code",
      description: "Editor de código fuente ligero y potente. Mi herramienta principal para desarrollo web, con extensiones y soporte para múltiples lenguajes.",
      icon: <Globe className="h-8 w-8 text-primary" />,
      features: ["Multi-lenguaje", "Extensiones", "Git Integrado"],
      downloadLink: "https://code.visualstudio.com/"
    }
  ];

  return (
    <section id="programs" className="section-padding bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Programas que Utilizo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Herramientas esenciales para el desarrollo y estudio que recomiendo a otros estudiantes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card 
              key={program.title} 
              className="card-glow bg-card border-primary/10 hover:border-primary/30 transition-all duration-300 h-full"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-2xl w-fit">
                  {program.icon}
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {program.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {program.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary">Características principales:</h4>
                  <ul className="space-y-1">
                    {program.features.map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button 
                  asChild
                  className="w-full btn-primary-glow rounded-xl"
                >
                  <a 
                    href={program.downloadLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Más
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;