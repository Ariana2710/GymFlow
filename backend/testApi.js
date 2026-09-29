const http = require('http');

function realizarPeticion(path, metodo, datos) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(datos);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
    });

    req.on('error', err => reject(err));
    req.write(dataString);
    req.end();
  });
}

async function probarAPI() {
  try {
    console.log('🚀 Probando endpoints de GymFlow...\n');

    // 1. Probar registro
    console.log('1️⃣ Registrando usuario admin...');
    const resRegistro = await realizarPeticion('/api/auth/register', 'POST', {
      nombre: 'Admin Gym',
      email: 'admin@gymflow.com',
      password: 'Password123!',
      rol: 'admin'
    });
    console.log(` Status ${resRegistro.status}:`, resRegistro.body);

    // 2. Probar creación de clase
    console.log('\n2️⃣ Creando primera clase...');
    const resClase = await realizarPeticion('/api/clases', 'POST', {
      nombre: 'Spinning Matutino',
      cupo: 15,
      horario: '08:00 AM',
      instructor: 'Carlos'
    });
    console.log(` Status ${resClase.status}:`, resClase.body);

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

probarAPI();