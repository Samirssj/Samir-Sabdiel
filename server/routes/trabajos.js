import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/trabajos - Obtener todos los trabajos (requiere autenticación)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: trabajos, error } = await supabase
      .from('trabajos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: trabajos,
      count: trabajos.length
    });

  } catch (error) {
    console.error('Error fetching trabajos:', error);
    res.status(500).json({
      error: 'Error al obtener trabajos',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/trabajos/public - Obtener trabajos para mostrar públicamente (sin autenticación)
router.get('/public', async (req, res) => {
  try {
    const { data: trabajos, error } = await supabase
      .from('trabajos')
      .select('id, titulo, descripcion, categoria, curso, tipo, imagen_url, link_descarga, tecnologias, fecha')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: trabajos,
      count: trabajos.length
    });

  } catch (error) {
    console.error('Error fetching public trabajos:', error);
    res.status(500).json({
      error: 'Error al obtener trabajos públicos',
      code: 'FETCH_ERROR'
    });
  }
});

// GET /api/trabajos/:id - Obtener un trabajo específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: trabajo, error } = await supabase
      .from('trabajos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !trabajo) {
      return res.status(404).json({
        error: 'Trabajo no encontrado',
        code: 'NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: trabajo
    });

  } catch (error) {
    console.error('Error fetching trabajo:', error);
    res.status(500).json({
      error: 'Error al obtener trabajo',
      code: 'FETCH_ERROR'
    });
  }
});

// POST /api/trabajos - Crear nuevo trabajo
router.post('/', [
  authenticateToken,
  body('titulo').trim().notEmpty().withMessage('Título es requerido'),
  body('descripcion').trim().notEmpty().withMessage('Descripción es requerida'),
  body('categoria').trim().notEmpty().withMessage('Categoría es requerida'),
  body('curso').trim().notEmpty().withMessage('Curso es requerido'),
  body('tipo').trim().notEmpty().withMessage('Tipo es requerido'),
  body('tecnologias').isArray().withMessage('Tecnologías debe ser un array'),
  body('link_descarga').optional().isURL().withMessage('Link de descarga debe ser una URL válida'),
  body('imagen_url').optional().isURL().withMessage('URL de imagen debe ser válida')
], async (req, res) => {
  try {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { titulo, descripcion, categoria, curso, tipo, tecnologias, link_descarga, imagen_url, fecha } = req.body;

    const { data: trabajo, error } = await supabase
      .from('trabajos')
      .insert([{
        titulo,
        descripcion,
        categoria,
        curso,
        tipo,
        tecnologias,
        link_descarga: link_descarga || '#',
        imagen_url: imagen_url || null,
        fecha: fecha || new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Trabajo creado exitosamente',
      data: trabajo
    });

  } catch (error) {
    console.error('Error creating trabajo:', error);
    res.status(500).json({
      error: 'Error al crear trabajo',
      code: 'CREATE_ERROR'
    });
  }
});

// PUT /api/trabajos/:id - Actualizar trabajo existente
router.put('/:id', [
  authenticateToken,
  body('titulo').optional().trim().notEmpty().withMessage('Título no puede estar vacío'),
  body('descripcion').optional().trim().notEmpty().withMessage('Descripción no puede estar vacía'),
  body('categoria').optional().trim().notEmpty().withMessage('Categoría no puede estar vacía'),
  body('curso').optional().trim().notEmpty().withMessage('Curso no puede estar vacío'),
  body('tipo').optional().trim().notEmpty().withMessage('Tipo no puede estar vacío'),
  body('tecnologias').optional().isArray().withMessage('Tecnologías debe ser un array'),
  body('link_descarga').optional().isURL().withMessage('Link de descarga debe ser una URL válida'),
  body('imagen_url').optional().isURL().withMessage('URL de imagen debe ser válida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Agregar timestamp de actualización
    updateData.updated_at = new Date().toISOString();

    const { data: trabajo, error } = await supabase
      .from('trabajos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Trabajo no encontrado',
          code: 'NOT_FOUND'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Trabajo actualizado exitosamente',
      data: trabajo
    });

  } catch (error) {
    console.error('Error updating trabajo:', error);
    res.status(500).json({
      error: 'Error al actualizar trabajo',
      code: 'UPDATE_ERROR'
    });
  }
});

// DELETE /api/trabajos/:id - Eliminar trabajo
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: trabajo, error } = await supabase
      .from('trabajos')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Trabajo no encontrado',
          code: 'NOT_FOUND'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Trabajo eliminado exitosamente',
      data: trabajo
    });

  } catch (error) {
    console.error('Error deleting trabajo:', error);
    res.status(500).json({
      error: 'Error al eliminar trabajo',
      code: 'DELETE_ERROR'
    });
  }
});

export default router;
