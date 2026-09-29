const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const conectarDB = require('./config/db');

dotenv.config({ path: './.env' });

const app = express();

conectarDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/clases', require('./routes/claseRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[SERVER] Servidor corriendo exitosamente en el puerto ${PORT}`);
});