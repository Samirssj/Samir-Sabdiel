import jwt from 'jsonwebtoken';
import { supabase } from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token de acceso requerido' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe en la base de datos
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};

export const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
  );
};