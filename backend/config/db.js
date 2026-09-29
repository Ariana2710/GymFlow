const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
  try {
    const connStr = process.env.MONGO_URI;
    
    if (!connStr) {
      throw new Error('La variable MONGO_URI no está definida en el archivo .env');
    }

    await mongoose.connect(connStr);
    console.log('[DATABASE] Conectado exitosamente a MongoDB Atlas (GymFlow DB)');
  } catch (error) {
    console.error('[DATABASE ERROR] Fallo al conectar a la BD:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;