import { supabase } from '../config/database.js';

const deleteAllWorks = async () => {
  try {
    console.log('🗑️ Eliminando todos los trabajos registrados...');

    // Verificar si hay registros en la tabla
    const { data: existingData, error: fetchError } = await supabase
      .from('trabajos') // Cambia 'trabajos' por el nombre exacto de tu tabla
      .select('*');

    if (fetchError) {
      console.error('❌ Error obteniendo trabajos:', fetchError);
      return;
    }

    if (!existingData || existingData.length === 0) {
      console.log('⚠️ No hay trabajos registrados para eliminar.');
      return;
    }

    // Eliminar todos los registros
    const { data, error } = await supabase
      .from('trabajos')
      .delete();

    if (error) {
      console.error('❌ Error eliminando trabajos:', error);
    } else {
      console.log('✅ Todos los trabajos han sido eliminados:', data);
    }
  } catch (error) {
    console.error('❌ Error ejecutando el script:', error);
  }
};

deleteAllWorks();