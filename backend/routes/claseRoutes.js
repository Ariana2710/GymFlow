const express = require('express');
const router = express.Router();
const claseController = require('../controllers/claseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', claseController.obtenerClases);

router.post('/', authMiddleware, claseController.crearClase);

router.post('/:id/reservar', authMiddleware, claseController.reservarClase);

router.put('/:id', authMiddleware, claseController.actualizarClase);

router.delete('/:id', authMiddleware, claseController.eliminarClase);

module.exports = router;
