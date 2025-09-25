import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Tipos TypeScript
export interface LoginCredentials {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

export interface Trabajo {
  id?: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  curso: string;
  tipo: string;
  imagen_url?: string;
  link_descarga?: string;
  tecnologias: string[];
  fecha?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

// Servicios de autenticación
export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // Llama al endpoint serverless de Vercel en la misma URL del frontend
    const response = await axios.post('/api/login', credentials, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data as LoginResponse;
  },

  // En el nuevo flujo sin backend persistente, la verificación se hace localmente
  verify: async (): Promise<{ valid: boolean; user?: any }> => {
    return { valid: isAuthenticated() };
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }
};

// Servicios de trabajos
export const trabajosService = {
  // Obtener todos los trabajos (admin)
  getAll: async (): Promise<ApiResponse<Trabajo[]>> => {
    const response = await api.get('/trabajos');
    return response.data;
  },

  // Obtener trabajos públicos (sin autenticación)
  getPublic: async (): Promise<ApiResponse<Trabajo[]>> => {
    const response = await axios.get(`${API_BASE_URL}/trabajos/public`);
    return response.data;
  },

  // Obtener trabajo por ID
  getById: async (id: number): Promise<ApiResponse<Trabajo>> => {
    const response = await api.get(`/trabajos/${id}`);
    return response.data;
  },

  // Crear nuevo trabajo
  create: async (trabajo: Omit<Trabajo, 'id'>): Promise<ApiResponse<Trabajo>> => {
    const response = await api.post('/trabajos', trabajo);
    return response.data;
  },

  // Actualizar trabajo
  update: async (id: number, trabajo: Partial<Trabajo>): Promise<ApiResponse<Trabajo>> => {
    const response = await api.put(`/trabajos/${id}`, trabajo);
    return response.data;
  },

  // Eliminar trabajo
  delete: async (id: number): Promise<ApiResponse<Trabajo>> => {
    const response = await api.delete(`/trabajos/${id}`);
    return response.data;
  }
};

// Utilidades
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('admin_token');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('admin_user');
  return user ? JSON.parse(user) : null;
};

export const setAuthData = (token: string, user: any) => {
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', JSON.stringify(user));
};

export default api;
