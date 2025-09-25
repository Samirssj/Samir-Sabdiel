import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Search, 
  Filter,
  Eye,
  Download,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  trabajosService, 
  authService, 
  getStoredUser, 
  type Trabajo 
} from '@/services/api';

const AdminDashboard = () => {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [filteredTrabajos, setFilteredTrabajos] = useState<Trabajo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; trabajo?: Trabajo }>({ open: false });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getStoredUser();

  // Cargar trabajos al montar el componente
  useEffect(() => {
    loadTrabajos();
  }, []);

  // Filtrar trabajos cuando cambie el término de búsqueda o categoría
  useEffect(() => {
    filterTrabajos();
  }, [trabajos, searchTerm, selectedCategory]);

  const loadTrabajos = async () => {
    try {
      setIsLoading(true);
      const response = await trabajosService.getAll();
      
      if (response.success && response.data) {
        setTrabajos(response.data);
      }
    } catch (error: any) {
      console.error('Error loading trabajos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los trabajos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTrabajos = () => {
    let filtered = trabajos;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(trabajo =>
        trabajo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trabajo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trabajo.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trabajo.tecnologias.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(trabajo => trabajo.categoria === selectedCategory);
    }

    setFilteredTrabajos(filtered);
  };

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente"
    });
    navigate('/admin/login');
  };

  const handleDelete = async (trabajo: Trabajo) => {
    try {
      if (!trabajo.id) return;
      
      await trabajosService.delete(trabajo.id);
      
      toast({
        title: "Trabajo eliminado",
        description: `"${trabajo.titulo}" ha sido eliminado correctamente`
      });
      
      // Recargar la lista
      loadTrabajos();
      setDeleteDialog({ open: false });
      
    } catch (error: any) {
      console.error('Error deleting trabajo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el trabajo",
        variant: "destructive"
      });
    }
  };

  const categories = [
    { id: 'all', name: 'Todos', count: trabajos.length },
    { id: 'java', name: 'Java', count: trabajos.filter(t => t.categoria === 'java').length },
    { id: 'web', name: 'Web', count: trabajos.filter(t => t.categoria === 'web').length },
    { id: 'database', name: 'Base de Datos', count: trabajos.filter(t => t.categoria === 'database').length },
    { id: 'research', name: 'Investigación', count: trabajos.filter(t => t.categoria === 'research').length },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Sin fecha';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Panel de Administración</h1>
              <p className="text-muted-foreground">
                Bienvenido, <span className="font-medium">{user?.usuario}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/admin/trabajos/new')}
                className="btn-primary-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Trabajo
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Trabajos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{trabajos.length}</div>
            </CardContent>
          </Card>
          
          <Card className="card-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Proyectos Java
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {trabajos.filter(t => t.categoria === 'java').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Proyectos Web
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {trabajos.filter(t => t.categoria === 'web').length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-glow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Investigaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {trabajos.filter(t => t.categoria === 'research').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-glow mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar trabajos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? "btn-primary-glow" : ""}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trabajos List */}
        <div className="grid gap-6">
          {filteredTrabajos.length === 0 ? (
            <Card className="card-glow">
              <CardContent className="pt-6 text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay trabajos</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'No se encontraron trabajos con los filtros aplicados'
                    : 'Aún no has agregado ningún trabajo'
                  }
                </p>
                <Button onClick={() => navigate('/admin/trabajos/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Trabajo
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTrabajos.map((trabajo) => (
              <Card key={trabajo.id} className="card-glow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{trabajo.titulo}</h3>
                        <Badge variant="secondary" className="ml-2">
                          {trabajo.tipo}
                        </Badge>
                      </div>
                      
                      <p className="text-primary font-medium text-sm mb-2">
                        {trabajo.curso}
                      </p>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {trabajo.descripcion}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {trabajo.tecnologias.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(trabajo.fecha)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {trabajo.link_descarga && trabajo.link_descarga !== '#' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(trabajo.link_descarga, '_blank')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/trabajos/${trabajo.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, trabajo })}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar trabajo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El trabajo "{deleteDialog.trabajo?.titulo}" 
              será eliminado permanentemente de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.trabajo && handleDelete(deleteDialog.trabajo)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
