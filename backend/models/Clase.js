const mongoose = require('mongoose');

const claseSchema = new mongoose.Schema({
  dia: { 
    type: String, 
    required: [true, 'El día es obligatorio'] 
  }, 
  hora: { 
    type: String, 
    required: [true, 'La hora es obligatoria'] 
  }, 
  nombre: { 
    type: String, 
    required: [true, 'El nombre de la clase es obligatorio'] 
  }, 
  instructor: { 
    type: String, 
    required: [true, 'El instructor es obligatorio'] 
  },
  cupoMaximo: { 
    type: Number, 
    required: true, 
    default: 20 
  },
  reservas: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Clase', claseSchema);