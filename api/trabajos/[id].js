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

  // Extraer :id desde el path: /api/trabajos/:id
  const pathOnly = req.url.split('?')[0];
  const segments = pathOnly.split('/').filter(Boolean); // ['api','trabajos',':id']
  const id = segments.length >= 3 ? parseInt(segments[2], 10) : NaN;

  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, error: 'ID inválido' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('trabajos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ success: false, error: 'Trabajo no encontrado' });
        }
        throw error;
      }

      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'PUT') {
      // Asegurar body como objeto
      const body = typeof req.body === 'object' ? req.body : {};
      body.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('trabajos')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ success: false, error: 'Trabajo no encontrado' });
        }
        throw error;
      }

      return res.status(200).json({ success: true, message: 'Trabajo actualizado', data });
    }

    if (req.method === 'DELETE') {
      const { data, error } = await supabase
        .from('trabajos')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ success: false, error: 'Trabajo no encontrado' });
        }
        throw error;
      }

      return res.status(200).json({ success: true, message: 'Trabajo eliminado', data });
    }

    return res.status(405).json({ success: false, error: 'Método no permitido' });
  } catch (err) {
    console.error('API /api/trabajos/[id] error:', err);
    return res.status(500).json({ success: false, error: 'Error del servidor', details: String(err?.message || err) });
  }
}