import { supabase } from '@/lib/supabase';

// Tipos TypeScript
export interface LoginCredentials {
  email?: string;
  usuario?: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: number; usuario: string; email?: string; rol?: string };
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
  url_prueba?: string;
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
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.toLowerCase();
    const loginEmail = (credentials.email || credentials.usuario || '').trim().toLowerCase();

    if (!loginEmail || !credentials.password) {
      return { success: false, message: 'Email y contraseña son requeridos' };
    }

    // Autenticación mediante RPC segura en Supabase
    const { data: rows, error } = await supabase.rpc('auth_login', {
      p_usuario: loginEmail,
      p_password: credentials.password,
    });

    if (error || !rows || rows.length === 0) {
      return { success: false, message: 'Credenciales inválidas' };
    }

    const user = rows[0] as { id: number; usuario: string; rol?: string };
    const isAdmin = (user.rol === 'admin') || (adminEmail ? loginEmail === adminEmail : false);

    const token = 'local_session';
    const userPayload = { id: user.id, usuario: user.usuario, email: loginEmail, rol: isAdmin ? 'admin' : (user.rol || 'user') };
    setAuthData(token, userPayload);

    return { success: true, message: 'Login exitoso', token, user: userPayload };
  },

  // En el nuevo flujo sin backend persistente, la verificación se hace localmente
  verify: async (): Promise<{ valid: boolean; user?: any; isAdmin?: boolean }> => {
    const user = getStoredUser();
    if (!isAuthenticated() || !user) return { valid: false };
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.toLowerCase();
    const isAdmin = user?.rol === 'admin' || (adminEmail ? user?.email?.toLowerCase() === adminEmail : false);
    return { valid: !!isAdmin, user, isAdmin };
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
    const { data, error } = await supabase
      .from('trabajos')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return { success: false, error: error.message };
    return { success: true, data: data || [], count: data?.length };
  },

  // Obtener trabajos públicos (sin autenticación)
  getPublic: async (): Promise<ApiResponse<Trabajo[]>> => {
    const { data, error } = await supabase
      .from('trabajos')
      .select('id, titulo, descripcion, categoria, curso, tipo, imagen_url, link_descarga, url_prueba, tecnologias, fecha, created_at')
      .order('created_at', { ascending: false });
    if (error) return { success: false, error: error.message };
    return { success: true, data: data || [], count: data?.length };
  },

  // Obtener trabajo por ID
  getById: async (id: number): Promise<ApiResponse<Trabajo>> => {
    const { data, error } = await supabase
      .from('trabajos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return { success: false, error: error.message } as any;
    return { success: true, data: data as Trabajo };
  },

  // Crear nuevo trabajo (RPC segura)
  create: async (trabajo: Omit<Trabajo, 'id'>, adminPassword: string): Promise<ApiResponse<Trabajo>> => {
    const user = getStoredUser();
    const email = user?.email || user?.usuario;
    if (!email) return { success: false, error: 'Sesión no válida' } as any;

    const { data, error } = await supabase.rpc('admin_create_trabajo', {
      p_usuario: (email as string).toLowerCase(),
      p_password: adminPassword,
      p_titulo: trabajo.titulo,
      p_descripcion: trabajo.descripcion,
      p_categoria: trabajo.categoria,
      p_curso: trabajo.curso,
      p_tipo: trabajo.tipo,
      p_tecnologias: trabajo.tecnologias,
      p_link_descarga: trabajo.link_descarga || '',
      p_imagen_url: trabajo.imagen_url || '',
      p_url_prueba: trabajo.url_prueba || '',
      p_fecha: trabajo.fecha || null,
    });
    if (error) return { success: false, error: error.message } as any;
    return { success: true, data: (data as any) as Trabajo, message: 'Trabajo creado exitosamente' };
  },

  // Actualizar trabajo (RPC segura)
  update: async (id: number, trabajo: Partial<Trabajo>, adminPassword: string): Promise<ApiResponse<Trabajo>> => {
    const user = getStoredUser();
    const email = user?.email || user?.usuario;
    if (!email) return { success: false, error: 'Sesión no válida' } as any;

    const { data, error } = await supabase.rpc('admin_update_trabajo', {
      p_usuario: (email as string).toLowerCase(),
      p_password: adminPassword,
      p_id: id,
      p_titulo: trabajo.titulo ?? null,
      p_descripcion: trabajo.descripcion ?? null,
      p_categoria: trabajo.categoria ?? null,
      p_curso: trabajo.curso ?? null,
      p_tipo: trabajo.tipo ?? null,
      p_tecnologias: trabajo.tecnologias ?? null,
      p_link_descarga: trabajo.link_descarga ?? null,
      p_imagen_url: trabajo.imagen_url ?? null,
      p_url_prueba: trabajo.url_prueba ?? null,
      p_fecha: (trabajo as any).fecha ?? null,
    });
    if (error) return { success: false, error: error.message } as any;
    return { success: true, data: (data as any) as Trabajo, message: 'Trabajo actualizado exitosamente' };
  },

  // Eliminar trabajo (RPC segura)
  delete: async (id: number, adminPassword: string): Promise<ApiResponse<Trabajo>> => {
    const user = getStoredUser();
    const email = user?.email || user?.usuario;
    if (!email) return { success: false, error: 'Sesión no válida' } as any;

    const { data, error } = await supabase.rpc('admin_delete_trabajo', {
      p_usuario: (email as string).toLowerCase(),
      p_password: adminPassword,
      p_id: id,
    });
    if (error) return { success: false, error: error.message } as any;
    return { success: true, data: (data as any) as Trabajo, message: 'Trabajo eliminado exitosamente' };
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

