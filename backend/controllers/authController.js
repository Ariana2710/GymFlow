const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registrar = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    
    let usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      rol
    });

    await nuevoUsuario.save();

    res.status(201).json({ msg: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al registrar usuario' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto_gymflow',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
};