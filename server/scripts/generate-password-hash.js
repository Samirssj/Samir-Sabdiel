import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const generatePasswordHash = async () => {
  console.log('🔐 Generador de Hash de Contraseña para Admin\n');
  
  rl.question('Ingresa la contraseña para el usuario admin: ', async (password) => {
    try {
      if (password.length < 6) {
        console.log('❌ La contraseña debe tener al menos 6 caracteres');
        rl.close();
        return;
      }

      console.log('\n⏳ Generando hash...');
      
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      
      console.log('\n✅ Hash generado exitosamente!');
      console.log('\n📋 Copia este hash y úsalo en tu base de datos:');
      console.log('─'.repeat(60));
      console.log(hash);
      console.log('─'.repeat(60));
      
      console.log('\n📝 SQL para actualizar la contraseña:');
      console.log(`UPDATE usuarios SET password_hash = '${hash}' WHERE usuario = 'admin';`);
      
      console.log('\n🔍 Para verificar que funciona:');
      const isValid = await bcrypt.compare(password, hash);
      console.log(`Verificación: ${isValid ? '✅ Válido' : '❌ Inválido'}`);
      
    } catch (error) {
      console.error('❌ Error generando hash:', error);
    } finally {
      rl.close();
    }
  });
};

generatePasswordHash();
