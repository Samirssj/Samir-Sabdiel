# Blog Académico con Panel de Administración

Un blog académico moderno desarrollado con **React + TypeScript** y **Node.js + Express**, con panel de administración completo para gestionar trabajos universitarios.

## Características

### Frontend
- **React 18** con TypeScript
- **Vite** para desarrollo rápido
- **Tailwind CSS** + **Shadcn/UI** para diseño moderno
- **React Router** para navegación
- **React Query** para manejo de estado
- Diseño responsive y accesible

### Backend
- **Node.js + Express** API RESTful
- **Supabase** (PostgreSQL) como base de datos
- **JWT** para autenticación segura
- **bcrypt** para encriptación de contraseñas
- Middleware de seguridad (Helmet, CORS, Rate Limiting)

### Panel de Administración
- Login seguro con JWT
- Dashboard con estadísticas
- CRUD completo de trabajos
- Filtros y búsqueda avanzada
- Formularios con validación
- Protección de rutas

## Estructura del Proyecto

```
tamara-codespace/
├── src/                          # Frontend React
│   ├── components/
│   │   ├── admin/               # Panel de administración
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── TrabajoForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── Works.tsx            # Componente público de trabajos
│   │   └── ...
│   ├── services/
│   │   └── api.ts               # Cliente API con Axios
│   └── ...
├── server/                      # Backend Node.js
│   ├── config/
│   │   └── database.js          # Configuración Supabase
│   ├── middleware/
│   │   └── auth.js              # Middleware JWT
│   ├── routes/
│   │   ├── auth.js              # Rutas de autenticación
│   │   └── trabajos.js          # Rutas CRUD trabajos
│   ├── scripts/
│   │   └── generate-password-hash.js
│   └── server.js                # Servidor principal
├── database/
│   └── supabase-setup.sql       # Script de configuración DB
└── README.md
```

## Configuración e Instalación

### 1. Prerrequisitos

- **Node.js** 18+ 
- **npm** o **yarn**
- Cuenta en **Supabase**

### 2. Configurar Base de Datos (Supabase)

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el script:

```sql
-- Ejecutar el contenido de database/supabase-setup.sql
```

3. Anota tu **Project URL** y **anon public key**

### 3. Configurar Backend

```bash
# Navegar al directorio del servidor
cd server

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
```

Edita `server/.env`:
```env
SUPABASE_URL=tu_supabase_project_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
JWT_SECRET=tu_clave_secreta_jwt_muy_larga_y_segura
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Generar Contraseña de Admin

```bash
# Generar hash de contraseña
npm run generate-password

# Seguir las instrucciones para actualizar la base de datos
```

### 5. Configurar Frontend

```bash
# Volver al directorio raíz
cd ..

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
```

Edita `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

## Ejecutar en Desarrollo

### Terminal 1: Backend
```bash
cd server
npm run dev
```

### Terminal 2: Frontend
```bash
npm run dev
```

## Acceso al Panel de Administración

1. Ve a `http://localhost:5173/admin/login`
2. Usuario: `admin`
3. Contraseña: la que configuraste con el script

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/verify` - Verificar token

### Trabajos
- `GET /api/trabajos/public` - Obtener trabajos (público)
- `GET /api/trabajos` - Obtener trabajos (admin) 
- `POST /api/trabajos` - Crear trabajo 
- `PUT /api/trabajos/:id` - Actualizar trabajo 
- `DELETE /api/trabajos/:id` - Eliminar trabajo 

 = Requiere autenticación JWT

## Despliegue

### Backend (Railway/Render/Heroku)

1. **Variables de entorno** en producción:
```env
SUPABASE_URL=tu_url_produccion
SUPABASE_ANON_KEY=tu_key_produccion
JWT_SECRET=clave_secreta_produccion
NODE_ENV=production
FRONTEND_URL=https://tu-dominio.com
```

2. **Script de inicio**: `npm start`

### Frontend (Vercel/Netlify)

1. **Variables de entorno**:
```env
VITE_API_URL=https://tu-api.com/api
```

2. **Build command**: `npm run build`
3. **Output directory**: `dist`

## Scripts Disponibles

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de producción
```

### Backend
```bash
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm run generate-password  # Generar hash de contraseña
```

## Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación JWT con expiración
- Rate limiting en endpoints
- Validación de datos de entrada
- Headers de seguridad con Helmet
- CORS configurado correctamente

## Solución de Problemas

### Error de conexión a la base de datos
- Verifica las credenciales de Supabase
- Asegúrate de que las tablas estén creadas

### Error 401 en el panel de admin
- Verifica que el JWT_SECRET sea el mismo en backend
- Regenera el hash de contraseña si es necesario

### Error de CORS
- Verifica que FRONTEND_URL esté configurado correctamente
- En producción, actualiza la URL del frontend

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## Autor

**Rojas Tamara Samir Sabiel**
- Universidad Peruana Los Andes
- Blog Académico y Portafolio de Proyectos

---

¡Dale una estrella si este proyecto te ayudó!
