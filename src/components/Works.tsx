import { useState } from "react";
import { Download, Search, BookOpen, Code2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Works = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const works = [
    {
      id: 1,
      title: "Sistema de Gestión Universitaria",
      description: "Aplicación Java con base de datos MySQL para gestionar estudiantes, cursos y calificaciones. Incluye interfaz gráfica y reportes.",
      category: "java",
      course: "Programación Orientada a Objetos",
      type: "Proyecto Final",
      downloadUrl: "#",
      tech: ["Java", "MySQL", "Swing"],
      icon: <Code2 className="h-5 w-5" />
    },
    {
      id: 2,
      title: "Sitio Web Corporativo",
      description: "Desarrollo completo de sitio web responsivo usando HTML, CSS, JavaScript y PHP. Incluye panel administrativo y base de datos.",
      category: "web",
      course: "Desarrollo Web",
      type: "Trabajo Grupal",
      downloadUrl: "#",
      tech: ["HTML", "CSS", "JavaScript", "PHP"],
      icon: <Database className="h-5 w-5" />
    },
    {
      id: 3,
      title: "Análisis de Algoritmos de Ordenamiento",
      description: "Investigación comparativa sobre eficiencia de algoritmos. Incluye implementaciones, análisis de complejidad y documentación completa.",
      category: "research",
      course: "Algoritmos y Estructuras de Datos",
      type: "Investigación",
      downloadUrl: "#",
      tech: ["Java", "Python", "LaTeX"],
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: 4,
      title: "Base de Datos Biblioteca",
      description: "Diseño e implementación de base de datos para sistema bibliotecario. Incluye modelado ER, normalización y procedimientos almacenados.",
      category: "database",
      course: "Base de Datos I",
      type: "Proyecto Individual",
      downloadUrl: "#",
      tech: ["MySQL", "SQL", "ERD"],
      icon: <Database className="h-5 w-5" />
    },
    {
      id: 5,
      title: "Calculadora Científica",
      description: "Aplicación desktop en Java con funciones matemáticas avanzadas. Interfaz intuitiva y manejo de expresiones complejas.",
      category: "java",
      course: "Programación I",
      type: "Proyecto Intermedio",
      downloadUrl: "#",
      tech: ["Java", "Swing", "Math"],
      icon: <Code2 className="h-5 w-5" />
    },
    {
      id: 6,
      title: "Portafolio Personal Web",
      description: "Desarrollo de portafolio personal usando tecnologías modernas. Diseño responsivo y optimizado para SEO.",
      category: "web",
      course: "Taller de Programación Web",
      type: "Proyecto Personal",
      downloadUrl: "#",
      tech: ["React", "Tailwind", "Vite"],
      icon: <Database className="h-5 w-5" />
    }
  ];

  const categories = [
    { id: "all", name: "Todos", count: works.length },
    { id: "java", name: "Java", count: works.filter(w => w.category === "java").length },
    { id: "web", name: "Desarrollo Web", count: works.filter(w => w.category === "web").length },
    { id: "database", name: "Bases de Datos", count: works.filter(w => w.category === "database").length },
    { id: "research", name: "Investigación", count: works.filter(w => w.category === "research").length }
  ];

  const filteredWorks = works.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || work.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (work: typeof works[0]) => {
    // Simulated download - in real app would trigger actual file download
    alert(`Descargando: ${work.title}`);
  };

  return (
    <section id="works" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Mis Trabajos de Universidad</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Repositorio de proyectos académicos disponibles para descarga libre. 
            Desde programación hasta investigación, aquí encontrarás recursos educativos de calidad.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, curso o tecnología..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-primary/20 focus:border-primary rounded-xl"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-xl ${
                  selectedCategory === category.id 
                    ? "btn-primary-glow" 
                    : "border-primary/20 text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Works Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => (
            <Card 
              key={work.id}
              className="card-glow bg-card border-primary/10 hover:border-primary/30 transition-all duration-300 h-full flex flex-col"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {work.icon}
                  </div>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {work.type}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-foreground line-clamp-2">
                  {work.title}
                </CardTitle>
                <CardDescription className="text-primary font-medium text-sm">
                  {work.course}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {work.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-primary mb-2">Tecnologías:</h4>
                    <div className="flex flex-wrap gap-1">
                      {work.tech.map((tech) => (
                        <span 
                          key={tech}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleDownload(work)}
                    className="w-full btn-primary-glow rounded-xl"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Trabajo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results message */}
        {filteredWorks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No se encontraron trabajos
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda o selecciona una categoría diferente.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Works;