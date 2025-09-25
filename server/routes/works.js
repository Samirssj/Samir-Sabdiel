import express from 'express';
import { body, validationResult } from 'express-validator';
import { supabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validaciones para trabajos
const workValidation = [
  body('titulo').notEmpty().withMessage('Título es requerido'),
  body('descripcion').notEmpty().withMessage('Descripción es requerida'),
  body('categoria').notEmpty().withMessage('Categoría es requerida'),
  body('tecnologias').isArray().withMessage('Tecnologías debe ser un array')
];

// GET /api/works - Obtener todos los trabajos (público)
router.get('/', async (req, res) => {
  try {
    const { data: works, error } = await supabase
      .from('trabajos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: works,
      count: works?.length || 0
    });

  } catch (error) {
    console.error('Error fetching works:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener trabajos',
      error: error.message
    });
  }
});

// GET /api/works/public - Ruta pública para trabajos (sin autenticación)
router.get('/public', async (req, res) => {
  try {
    const { data: works, error } = await supabase
      .from('trabajos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: works,
      count: works?.length || 0
    });

  } catch (error) {
    console.error('Error fetching public works:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener trabajos',
      error: error.message
    });
  }
});

// GET /api/works/:id - Obtener trabajo por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: work, error } = await supabase
      .from('trabajos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !work) {
      return res.status(404).json({
        success: false,
        message: 'Trabajo no encontrado'
      });
    }

    res.json({
      success: true,
      data: work
    });

  } catch (error) {
    console.error('Error obteniendo trabajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo trabajo'
    });
  }
});

// POST /api/works - Crear nuevo trabajo (protegido)
router.post('/', authenticateToken, workValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const workData = {
      ...req.body,
      usuario_id: req.user.id,
      fecha_actualizacion: new Date().toISOString()
    };

    const { data: work, error } = await supabase
      .from('trabajos')
      .insert([workData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Trabajo creado exitosamente',
      data: work
    });

  } catch (error) {
    console.error('Error creando trabajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando trabajo'
    });
  }
});

// PUT /api/works/:id - Actualizar trabajo (protegido)
router.put('/:id', authenticateToken, workValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = {
      ...req.body,
      fecha_actualizacion: new Date().toISOString()
    };

    const { data: work, error } = await supabase
      .from('trabajos')
      .update(updateData)
      .eq('id', id)
      .eq('usuario_id', req.user.id)
      .select()
      .single();

    if (error || !work) {
      return res.status(404).json({
        success: false,
        message: 'Trabajo no encontrado o sin permisos'
      });
    }

    res.json({
      success: true,
      message: 'Trabajo actualizado exitosamente',
      data: work
    });

  } catch (error) {
    console.error('Error actualizando trabajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando trabajo'
    });
  }
});

// DELETE /api/works/:id - Eliminar trabajo (protegido)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('trabajos')
      .delete()
      .eq('id', id)
      .eq('usuario_id', req.user.id);

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Trabajo no encontrado o sin permisos'
      });
    }

    res.json({
      success: true,
      message: 'Trabajo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando trabajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando trabajo'
    });
  }
});

export default router;
