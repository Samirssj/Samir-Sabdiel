// /api/trabajos.js - CRUD temporal en memoria (para pruebas en Vercel)
// Nota: al ser serverless, este arreglo NO es persistente entre despliegues o re-inicios,
// pero sirve para validar el flujo end-to-end desde el panel de administración.

let TRABAJOS = [];
let NEXT_ID = 1;

export default async function handler(req, res) {
  const method = req.method;

  // Asegurar cabeceras JSON
  res.setHeader('Content-Type', 'application/json');

  // Helper de respuesta
  const send = (status, payload) => res.status(status).json(payload);

  // Extraer id desde el path (/api/trabajos/:id) o desde query (?id=)
  const pathOnly = req.url.split('?')[0];
  const segments = pathOnly.split('/').filter(Boolean); // ['api','trabajos',':id?']
  const idFromPath = segments.length >= 3 ? parseInt(segments[2], 10) : NaN;
  const idFromQuery = req.query?.id ? parseInt(req.query.id, 10) : NaN;
  const id = Number.isFinite(idFromPath)
    ? idFromPath
    : (Number.isFinite(idFromQuery) ? idFromQuery : undefined);

  // POST /api/trabajos -> crear
  if (method === 'POST') {
    try {
      const {
        categoria = '',
        curso = '',
        tecnologias = [],
        imagen_url = '',
        link_descarga = '',
        titulo = '',
        descripcion = '',
        tipo = '',
        fecha = new Date().toISOString().split('T')[0],
      } = req.body || {};

      if (!categoria || !curso || !Array.isArray(tecnologias)) {
        return send(400, { error: 'Datos inválidos: categoria, curso y tecnologias (array) son requeridos' });
      }

      const nuevo = {
        id: NEXT_ID++,
        titulo,
        descripcion,
        categoria,
        curso,
        tipo,
        tecnologias,
        imagen_url,
        link_descarga,
        fecha,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      TRABAJOS.unshift(nuevo);
      return send(201, { success: true, data: nuevo, message: 'Trabajo agregado correctamente' });
    } catch (error) {
      return send(500, { success: false, error: 'Error al guardar el Trabajo' });
    }
  }

  // GET /api/trabajos -> listar todos | GET /api/trabajos/:id -> obtener uno
  if (method === 'GET') {
    if (id !== undefined) {
      const item = TRABAJOS.find(t => t.id === id);
      if (!item) return send(404, { success: false, error: 'Trabajo no encontrado' });
      return send(200, { success: true, data: item });
    }
    return send(200, { success: true, data: TRABAJOS, count: TRABAJOS.length });
  }

  // PUT /api/trabajos/:id o ?id= -> actualizar
  if (method === 'PUT') {
    try {
      if (id === undefined) return send(400, { success: false, error: 'Falta el parámetro id' });

      const idx = TRABAJOS.findIndex(t => t.id === id);
      if (idx === -1) return send(404, { success: false, error: 'Trabajo no encontrado' });

      const updates = req.body || {};
      TRABAJOS[idx] = {
        ...TRABAJOS[idx],
        ...updates,
        id, // proteger id
        updated_at: new Date().toISOString(),
      };

      return send(200, { success: true, data: TRABAJOS[idx], message: 'Trabajo actualizado correctamente' });
    } catch (error) {
      return send(500, { success: false, error: 'Error al actualizar el Trabajo' });
    }
  }

  // DELETE /api/trabajos/:id o ?id= -> eliminar
  if (method === 'DELETE') {
    try {
      if (id === undefined) return send(400, { success: false, error: 'Falta el parámetro id' });

      const idx = TRABAJOS.findIndex(t => t.id === id);
      if (idx === -1) return send(404, { success: false, error: 'Trabajo no encontrado' });

      const eliminado = TRABAJOS.splice(idx, 1)[0];
      return send(200, { success: true, data: eliminado, message: 'Trabajo eliminado correctamente' });
    } catch (error) {
      return send(500, { success: false, error: 'Error al eliminar el Trabajo' });
    }
  }

  // Método no permitido
  return send(405, { success: false, error: 'Método no permitido' });
}
