import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase desde variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } }) : null;

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (!supabase) {
    return res.status(500).json({ success: false, error: 'Configuración de Supabase no encontrada' });
  }

  const method = req.method;
  const pathOnly = req.url.split('?')[0];
  const segments = pathOnly.split('/').filter(Boolean); // ['api','trabajos',':id?'] o ['api','trabajos','public']
  const idFromPath = segments.length >= 3 ? parseInt(segments[2], 10) : NaN;
  const id = Number.isFinite(idFromPath) ? idFromPath : undefined;

  const send = (status, payload) => res.status(status).json(payload);

  const readBody = async () => {
    if (req.body && typeof req.body === 'object') return req.body;
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  };

  try {
    // GET /api/trabajos/public
    if (method === 'GET' && segments[1] === 'trabajos' && segments[2] === 'public') {
      const { data, error } = await supabase
        .from('trabajos')
        .select('id, titulo, descripcion, categoria, curso, tipo, imagen_url, link_descarga, tecnologias, fecha, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return send(200, { success: true, data: data || [], count: data?.length || 0 });
    }

    // GET /api/trabajos/:id
    if (method === 'GET' && id !== undefined) {
      const { data, error } = await supabase
        .from('trabajos')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        if (error.code === 'PGRST116') return send(404, { success: false, error: 'Trabajo no encontrado' });
        throw error;
      }
      return send(200, { success: true, data });
    }

    // GET /api/trabajos
    if (method === 'GET') {
      const { data, error } = await supabase
        .from('trabajos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return send(200, { success: true, data: data || [], count: data?.length || 0 });
    }

    // POST /api/trabajos
    if (method === 'POST') {
      const body = await readBody();
      const {
        titulo = '',
        descripcion = '',
        categoria = '',
        curso = '',
        tipo = '',
        tecnologias = [],
        link_descarga = '',
        imagen_url = '',
        fecha = new Date().toISOString().split('T')[0],
      } = body || {};

      if (!titulo.trim() || !descripcion.trim() || !categoria || !curso || !tipo || !Array.isArray(tecnologias)) {
        return send(400, { success: false, error: 'Datos inválidos' });
      }

      const payload = {
        titulo,
        descripcion,
        categoria,
        curso,
        tipo,
        tecnologias,
        link_descarga: link_descarga || '#',
        imagen_url: imagen_url || null,
        fecha,
      };

      const { data, error } = await supabase
        .from('trabajos')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return send(201, { success: true, message: 'Trabajo creado exitosamente', data });
    }

    // PUT /api/trabajos/:id
    if (method === 'PUT' && id !== undefined) {
      const updates = await readBody();
      updates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('trabajos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') return send(404, { success: false, error: 'Trabajo no encontrado' });
        throw error;
      }

      return send(200, { success: true, message: 'Trabajo actualizado exitosamente', data });
    }

    // DELETE /api/trabajos/:id
    if (method === 'DELETE' && id !== undefined) {
      const { data, error } = await supabase
        .from('trabajos')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') return send(404, { success: false, error: 'Trabajo no encontrado' });
        throw error;
      }

      return send(200, { success: true, message: 'Trabajo eliminado exitosamente', data });
    }

    return send(405, { success: false, error: 'Método no permitido' });
  } catch (err) {
    console.error('API /api/trabajos error:', err);
    return send(500, { success: false, error: 'Error del servidor', details: String(err?.message || err) });
  }
}
