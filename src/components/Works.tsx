import { useState, useEffect } from "react";
import { Download, Search, BookOpen, Code2, Database, Github, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { trabajosService, type Trabajo } from "@/services/api";

const Works = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [works, setWorks] = useState<Trabajo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Cargar trabajos desde la API
  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      setIsLoading(true);
      const response = await trabajosService.getPublic();

      if (response.success && response.data) {
        setWorks(response.data);
      } else {
        setWorks([]); // Si la API no responde, no mostrar trabajos
      }
    } catch (error) {
      console.error('Error loading works:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los trabajos",
        variant: "destructive"
      });
      setWorks([]); // No usar datos estáticos como fallback
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "Todos", count: works.length },
    { id: "java", name: "Java", count: works.filter(w => w.categoria === "java").length },
    { id: "web", name: "Desarrollo Web", count: works.filter(w => w.categoria === "web").length },
    { id: "database", name: "Bases de Datos", count: works.filter(w => w.categoria === "database").length },
    { id: "research", name: "Investigación", count: works.filter(w => w.categoria === "research").length }
  ];

  const filteredWorks = works.filter(work => {
    const matchesSearch = work.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.tecnologias.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || work.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openGithub = (work: Trabajo) => {
    const repo = ((work as any).link_repo_github as string) ||
                 (((work as any).link_descarga as string)?.includes('github.com') ? (work as any).link_descarga as string : undefined);
    if (repo && repo !== '#') {
      window.open(repo, '_blank');
      return;
    }
    toast({
      title: "Repositorio no disponible",
      description: `El enlace del repositorio para "${work.titulo}" no está disponible`,
      variant: "destructive"
    });
  };

  const openDemo = (work: Trabajo) => {
    if ((work as any).url_prueba) {
      window.open((work as any).url_prueba as string, '_blank');
    } else {
      toast({
        title: "URL de prueba no disponible",
        description: `La URL de prueba para "${work.titulo}" no está disponible`,
        variant: "destructive"
      });
    }
  };

  const getWorkIcon = (categoria: string) => {
    switch (categoria) {
      case 'java':
        return <Code2 className="h-5 w-5" />;
      case 'web':
        return <Database className="h-5 w-5" />;
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'research':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <Code2 className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <section id="works" className="section-padding bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Mis Trabajos de Universidad</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Repositorio de proyectos académicos disponibles para descarga libre. 
              Desde programación hasta investigación, aquí encontrarás recursos educativos de calidad.
            </p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando trabajos...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="works" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-foreground">
            Mis Trabajos de Universidad
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
              className="bg-card border border-border hover:border-primary/30 transition-colors duration-200 h-full flex flex-col rounded-2xl"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getWorkIcon(work.categoria)}
                  </div>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {work.tipo}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                  {work.titulo}
                </CardTitle>
                <CardDescription className="text-primary font-medium text-sm">
                  {work.curso}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {work.descripcion}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-primary mb-2">Tecnologías:</h4>
                    <div className="flex flex-wrap gap-1">
                      {work.tecnologias.map((tech, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button 
                      onClick={() => openGithub(work)}
                      className="w-full rounded-xl bg-primary hover:bg-[hsl(225_100%_56%)] transition-colors"
                      size="sm"
                      disabled={
                        !(((work as any).link_repo_github && (work as any).link_repo_github !== '#') ||
                          (((work as any).link_descarga)?.includes('github.com')))
                      }
                    >
                      <Github className="mr-2 h-4 w-4" />
                      Ver en Github
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => openDemo(work)}
                      className="w-full rounded-xl border-border hover:border-primary/40"
                      size="sm"
                      disabled={!((work as any).url_prueba)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Probar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results message */}
        {filteredWorks.length === 0 && !isLoading && (
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