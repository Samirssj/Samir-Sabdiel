import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL;

const supabaseKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  : null;

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!supabase) {
    return res.status(500).json({ success: false, error: 'Configuración de Supabase no encontrada' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método no permitido' });
  }

  try {
    const { data, error } = await supabase
      .from('trabajos')
      .select('id, titulo, descripcion, categoria, curso, tipo, imagen_url, link_descarga, tecnologias, fecha, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ success: true, data: data || [], count: data?.length || 0 });
  } catch (err) {
    console.error('GET /api/trabajos/public error:', err);
    return res.status(500).json({ success: false, error: 'Error del servidor', details: String(err?.message || err) });
  }
}