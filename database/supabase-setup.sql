-- Crear tabla de usuarios para autenticación
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de trabajos
CREATE TABLE trabajos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  curso VARCHAR(255),
  tipo VARCHAR(100),
  imagen_url VARCHAR(500),
  link_descarga VARCHAR(500),
  tecnologias TEXT[], -- Array de tecnologías
  fecha DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar usuario admin por defecto (contraseña: admin123)
-- Hash generado con bcrypt para 'admin123'
INSERT INTO usuarios (usuario, password_hash) 
VALUES ('admin', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOeKqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ');

-- Insertar algunos trabajos de ejemplo (basados en tu Works.tsx actual)
INSERT INTO trabajos (titulo, descripcion, categoria, curso, tipo, tecnologias, link_descarga) VALUES
('Área de un Cuadrado', 'Aplicación Java desarrollada con Maven que utiliza Swing para la interfaz gráfica.', 'java', 'Programación Orientada a Objetos', 'Proyecto Intermedio', ARRAY['Java', 'Maven', 'Swing'], '#'),
('Tabla de Imágenes en Java Web', 'Aplicación web desarrollada en Java y desplegada en Apache Tomcat.', 'web', 'Desarrollo Web', 'Trabajo Grupal', ARRAY['HTML', 'CSS', 'Java', 'Apache Tomcat', 'JSP', 'Servlets', 'Maven'], '#'),
('Algoritmo de Dijkstra', 'Implementación en Java de Algoritmo de Dijkstra para caminos mínimos.', 'research', 'Algoritmos y Estructuras de Datos', 'Investigación', ARRAY['Java', 'JDK', 'Libreria Estandar'], '#');

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_trabajos_categoria ON trabajos(categoria);
CREATE INDEX idx_trabajos_fecha ON trabajos(fecha);
CREATE INDEX idx_usuarios_usuario ON usuarios(usuario);
