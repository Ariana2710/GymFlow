const Clase = require('../models/Clase');


exports.obtenerClases = async (req, res) => {
  try {
    const clases = await Clase.find();
    res.json(clases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las clases' });
  }
};


exports.crearClase = async (req, res) => {
  try {
    const nuevaClase = new Clase(req.body);
    await nuevaClase.save();
    res.status(201).json(nuevaClase);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: 'Error al crear la clase' });
  }
};


exports.reservarClase = async (req, res) => {
  try {
    const { id } = req.params;
    const clase = await Clase.findById(id);

    if (!clase) {
      return res.status(404).json({ msg: 'Clase no encontrada' });
    }

    if (clase.reservas >= clase.cupoMaximo) {
      return res.status(400).json({ msg: 'El cupo para esta clase está lleno' });
    }

    clase.reservas += 1;
    await clase.save();

    res.json({ msg: 'Reserva realizada con éxito', clase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al reservar la clase' });
  }
};
exports.eliminarClase = async (req, res) => {
  try {
    const { id } = req.params;
    const claseEliminada = await Clase.findByIdAndDelete(id);
    if (!claseEliminada) {
      return res.status(404).json({ msg: 'Clase no encontrada' });
    }
    res.json({msg: 'Clase eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar la clase'});
  }
};
exports.actualizarClase = async (req, res) => {
  try {
    const { id } = req.params;
    const claseActualizada = await Clase.findByIdAndUpdate(id, req.body, { new: true });
    if (!claseActualizada) {
      return res.status(404).json({ msg: 'Clase no encontrada' });
    }
    res.json({ msg: 'Clase actualizada correctamente', clase: claseActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar la clase'});
  }
};