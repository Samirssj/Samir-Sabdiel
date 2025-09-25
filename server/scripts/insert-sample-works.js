import { supabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleWorks = [
  {
    titulo: 'Área de un Cuadrado',
    descripcion: 'Aplicación Java desarrollada con Maven que utiliza Swing para la interfaz gráfica. Permite calcular el área de diferentes figuras geométricas con una interfaz intuitiva.',
    categoria: 'java',
    curso: 'Programación Orientada a Objetos',
    tipo: 'Proyecto Intermedio',
    tecnologias: ['Java', 'Maven', 'Swing', 'JDK'],
    imagen_url: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Java+Project',
    link_descarga: '#',
    fecha: '2024-03-15'
  },
  {
    titulo: 'Tabla de Imágenes en Java Web',
    descripcion: 'Aplicación web desarrollada en Java y desplegada en Apache Tomcat. Permite gestionar y visualizar imágenes en una tabla dinámica con funcionalidades CRUD.',
    categoria: 'web',
    curso: 'Desarrollo Web',
    tipo: 'Trabajo Grupal',
    tecnologias: ['HTML', 'CSS', 'Java', 'Apache Tomcat', 'JSP', 'Servlets', 'Maven'],
    imagen_url: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Web+App',
    link_descarga: '#',
    fecha: '2024-04-20'
  },
  {
    titulo: 'Algoritmo de Dijkstra',
    descripcion: 'Implementación en Java del Algoritmo de Dijkstra para encontrar caminos mínimos en grafos. Incluye visualización gráfica del proceso de búsqueda.',
    categoria: 'research',
    curso: 'Algoritmos y Estructuras de Datos',
    tipo: 'Investigación',
    tecnologias: ['Java', 'JDK', 'Algoritmos', 'Grafos'],
    imagen_url: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Algorithm',
    link_descarga: '#',
    fecha: '2024-05-10'
  },
  {
    titulo: 'Sistema de Gestión de Biblioteca',
    descripcion: 'Sistema completo de gestión de biblioteca desarrollado con Java y MySQL. Permite gestionar libros, usuarios, préstamos y devoluciones.',
    categoria: 'database',
    curso: 'Base de Datos',
    tipo: 'Proyecto Final',
    tecnologias: ['Java', 'MySQL', 'JDBC', 'Swing', 'Maven'],
    imagen_url: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Database+System',
    link_descarga: '#',
    fecha: '2024-06-15'
  },
  {
    titulo: 'Aplicación Móvil de Notas',
    descripcion: 'Aplicación móvil para Android desarrollada en Java que permite crear, editar y organizar notas personales con sincronización en la nube.',
    categoria: 'mobile',
    curso: 'Desarrollo Móvil',
    tipo: 'Proyecto Individual',
    tecnologias: ['Java', 'Android Studio', 'SQLite', 'Firebase'],
    imagen_url: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Mobile+App',
    link_descarga: '#',
    fecha: '2024-07-22'
  }
];

const insertSampleWorks = async () => {
  try {
    console.log('📝 Insertando trabajos de ejemplo...');
    
    // Verificar conexión
    const { data: testData, error: testError } = await supabase
      .from('trabajos')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError);
      return;
    }
    
    // Insertar trabajos de ejemplo
    const { data, error } = await supabase
      .from('trabajos')
      .insert(sampleWorks)
      .select();
    
    if (error) {
      console.error('❌ Error insertando trabajos:', error);
      return;
    }
    
    console.log('✅ Trabajos insertados correctamente:');
    console.log(`📊 Total de trabajos insertados: ${data?.length || 0}`);
    
    data?.forEach((trabajo, index) => {
      console.log(`${index + 1}. ${trabajo.titulo} (${trabajo.categoria})`);
    });
    
    console.log('\n🎉 ¡Listo! Ahora puedes ver los trabajos en tu página web.');
    console.log('🔗 Ve a: http://localhost:8080');
    console.log('🔧 Panel admin: http://localhost:8080/admin/login');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

insertSampleWorks();
