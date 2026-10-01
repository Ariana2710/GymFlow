const express = require('express');
const router = express.Router();
const claseController = require('../controllers/claseController');

router.get('/', claseController.obtenerClases);

router.post('/', claseController.crearClase);

router.post('/:id/reservar', claseController.reservarClase);

router.put('/:id', claseController.actualizarClase);

module.exports = router;
router.delete('/:id', claseController.eliminarClase);