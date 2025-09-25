import bcrypt from 'bcryptjs';
import { supabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const testLogin = async () => {
  try {
    console.log('🔐 Generando hash para admin123...');
    
    // Generar hash correcto para admin123
    const password = 'admin123';
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('✅ Hash generado:', hash);
    
    // Verificar que el hash funciona
    const isValid = await bcrypt.compare(password, hash);
    console.log('🔍 Verificación del hash:', isValid ? '✅ Válido' : '❌ Inválido');
    
    // Insertar o actualizar usuario en la base de datos
    console.log('\n📝 Insertando usuario admin en la base de datos...');
    
    const { data, error } = await supabase
      .from('usuarios')
      .upsert({
        usuario: 'admin',
        password_hash: hash
      }, {
        onConflict: 'usuario'
      })
      .select();
    
    if (error) {
      console.error('❌ Error insertando usuario:', error);
    } else {
      console.log('✅ Usuario admin creado/actualizado correctamente');
      console.log('📋 Datos:', data);
    }
    
    // Probar login
    console.log('\n🧪 Probando login...');
    const { data: user, error: loginError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', 'admin')
      .single();
    
    if (loginError || !user) {
      console.error('❌ Error obteniendo usuario:', loginError);
      return;
    }
    
    console.log('👤 Usuario encontrado:', user.usuario);
    
    const loginValid = await bcrypt.compare('admin123', user.password_hash);
    console.log('🔑 Login válido:', loginValid ? '✅ SÍ' : '❌ NO');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

testLogin();
