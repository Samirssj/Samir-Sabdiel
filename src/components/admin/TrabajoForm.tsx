import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { trabajosService, type Trabajo } from '@/services/api';

const TrabajoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditing);
  const [newTech, setNewTech] = useState('');
  
  const [formData, setFormData] = useState<Omit<Trabajo, 'id'>>({
    titulo: '',
    descripcion: '',
    categoria: '',
    curso: '',
    tipo: '',
    imagen_url: '',
    link_repo_github: '',
    url_prueba: '',
    tecnologias: [],
    fecha: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos del trabajo si estamos editando
  useEffect(() => {
    if (isEditing && id) {
      loadTrabajo(parseInt(id));
    }
  }, [id, isEditing]);

  const loadTrabajo = async (trabajoId: number) => {
    try {
      setIsLoadingData(true);
      const response = await trabajosService.getById(trabajoId);
      
      if (response.success && response.data) {
        const trabajo = response.data;
        setFormData({
          titulo: trabajo.titulo,
          descripcion: trabajo.descripcion,
          categoria: trabajo.categoria,
          curso: trabajo.curso,
          tipo: trabajo.tipo,
          imagen_url: trabajo.imagen_url || '',
          link_repo_github: (trabajo as any).link_repo_github || (trabajo as any).link_descarga || '',
          url_prueba: (trabajo as any).url_prueba || '',
          tecnologias: trabajo.tecnologias,
          fecha: trabajo.fecha || new Date().toISOString().split('T')[0]
        });
      }
    } catch (error: any) {
      console.error('Error loading trabajo:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el trabajo",
        variant: "destructive"
      });
      navigate('/admin/dashboard');
    } finally {
      setIsLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!formData.curso.trim()) {
      newErrors.curso = 'El curso es requerido';
    }

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'El tipo es requerido';
    }

    if (formData.tecnologias.length === 0) {
      newErrors.tecnologias = 'Debe agregar al menos una tecnología';
    }

    if (formData.imagen_url && !isValidUrl(formData.imagen_url)) {
      newErrors.imagen_url = 'La URL de imagen no es válida';
    }

    if (formData.link_repo_github && !isValidUrl(formData.link_repo_github)) {
      newErrors.link_repo_github = 'La URL del repositorio no es válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addTechnology = () => {
    if (newTech.trim() && !formData.tecnologias.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        tecnologias: [...prev.tecnologias, newTech.trim()]
      }));
      setNewTech('');
      
      if (errors.tecnologias) {
        setErrors(prev => ({
          ...prev,
          tecnologias: ''
        }));
      }
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      tecnologias: prev.tecnologias.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Errores en el formulario",
        description: "Por favor corrige los errores antes de continuar",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Pedir contraseña de administrador antes de mutar
      const adminPassword = window.prompt('Ingresa tu contraseña para confirmar la operación:');
      if (!adminPassword) {
        setIsLoading(false);
        return;
      }

      if (isEditing && id) {
        const res = await trabajosService.update(parseInt(id), formData, adminPassword);
        if (!res.success) {
          throw new Error(res.error || 'Error al actualizar el trabajo');
        }
        toast({
          title: "Trabajo actualizado",
          description: "El trabajo ha sido actualizado correctamente"
        });
      } else {
        const res = await trabajosService.create(formData, adminPassword);
        if (!res.success) {
          throw new Error(res.error || 'Error al crear el trabajo');
        }
        toast({
          title: "Trabajo creado",
          description: "El trabajo ha sido creado correctamente"
        });
      }

      navigate('/admin/dashboard');
      
    } catch (error: any) {
      console.error('Error saving trabajo:', error);
      const message = error?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el trabajo`;
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando trabajo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                {isEditing ? 'Editar Trabajo' : 'Nuevo Trabajo'}
              </h1>
              <p className="text-muted-foreground">
                {isEditing ? 'Modifica los datos del trabajo' : 'Agrega un nuevo trabajo a tu portafolio'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>
              {isEditing ? 'Editar Trabajo' : 'Crear Nuevo Trabajo'}
            </CardTitle>
            <CardDescription>
              Completa todos los campos para {isEditing ? 'actualizar' : 'agregar'} el trabajo
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange('titulo')}
                  placeholder="Ej: Aplicación de gestión de inventario"
                  className={errors.titulo ? 'border-red-500' : ''}
                />
                {errors.titulo && (
                  <p className="text-sm text-red-500">{errors.titulo}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange('descripcion')}
                  placeholder="Describe el proyecto, sus características principales y objetivos..."
                  rows={4}
                  className={errors.descripcion ? 'border-red-500' : ''}
                />
                {errors.descripcion && (
                  <p className="text-sm text-red-500">{errors.descripcion}</p>
                )}
              </div>

              {/* Fila de selects */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Categoría */}
                <div className="space-y-2">
                  <Label>Categoría *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={handleSelectChange('categoria')}
                  >
                    <SelectTrigger className={errors.categoria ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="web">Desarrollo Web</SelectItem>
                      <SelectItem value="database">Base de Datos</SelectItem>
                      <SelectItem value="research">Investigación</SelectItem>
                      <SelectItem value="mobile">Móvil</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.categoria && (
                    <p className="text-sm text-red-500">{errors.categoria}</p>
                  )}
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={handleSelectChange('tipo')}
                  >
                    <SelectTrigger className={errors.tipo ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Proyecto Individual">Proyecto Individual</SelectItem>
                      <SelectItem value="Proyecto Grupal">Proyecto Grupal</SelectItem>
                      <SelectItem value="Trabajo Grupal">Trabajo Grupal</SelectItem>
                      <SelectItem value="Proyecto Intermedio">Proyecto Intermedio</SelectItem>
                      <SelectItem value="Proyecto Final">Proyecto Final</SelectItem>
                      <SelectItem value="Investigación">Investigación</SelectItem>
                      <SelectItem value="Práctica">Práctica</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo && (
                    <p className="text-sm text-red-500">{errors.tipo}</p>
                  )}
                </div>

                {/* Fecha */}
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={handleInputChange('fecha')}
                  />
                </div>
              </div>

              {/* Curso */}
              <div className="space-y-2">
                <Label htmlFor="curso">Curso *</Label>
                <Input
                  id="curso"
                  value={formData.curso}
                  onChange={handleInputChange('curso')}
                  placeholder="Ej: Programación Orientada a Objetos"
                  className={errors.curso ? 'border-red-500' : ''}
                />
                {errors.curso && (
                  <p className="text-sm text-red-500">{errors.curso}</p>
                )}
              </div>

              {/* Tecnologías */}
              <div className="space-y-2">
                <Label>Tecnologías *</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Ej: Java, React, MySQL..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  />
                  <Button
                    type="button"
                    onClick={addTechnology}
                    variant="outline"
                    disabled={!newTech.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.tecnologias.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tecnologias.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                {errors.tecnologias && (
                  <p className="text-sm text-red-500">{errors.tecnologias}</p>
                )}
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* URL de imagen */}
                <div className="space-y-2">
                  <Label htmlFor="imagen_url">URL de Imagen</Label>
                  <Input
                    id="imagen_url"
                    value={formData.imagen_url}
                    onChange={handleInputChange('imagen_url')}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className={errors.imagen_url ? 'border-red-500' : ''}
                  />
                  {errors.imagen_url && (
                    <p className="text-sm text-red-500">{errors.imagen_url}</p>
                  )}
                </div>

                {/* Link de repo en GitHub */}
                <div className="space-y-2">
                  <Label htmlFor="link_repo_github">Link de repo en GitHub</Label>
                  <Input
                    id="link_repo_github"
                    value={(formData as any).link_repo_github}
                    onChange={handleInputChange('link_repo_github' as any)}
                    placeholder="https://github.com/usuario/proyecto"
                    className={errors.link_repo_github ? 'border-red-500' : ''}
                  />
                  {errors.link_repo_github && (
                    <p className="text-sm text-red-500">{errors.link_repo_github}</p>
                  )}
                </div>
              </div>

              {/* URL de Prueba */}
              <div className="space-y-2">
                <Label htmlFor="url_prueba">URL de Prueba</Label>
                <Input
                  id="url_prueba"
                  value={formData.url_prueba}
                  onChange={handleInputChange('url_prueba')}
                  placeholder="https://miapp.vercel.app/"
                  className={errors.url_prueba ? 'border-red-500' : ''}
                />
                {errors.url_prueba && (
                  <p className="text-sm text-red-500">{errors.url_prueba}</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  className="btn-primary-glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isEditing ? 'Actualizando...' : 'Creando...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>{isEditing ? 'Actualizar Trabajo' : 'Crear Trabajo'}</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrabajoForm;
