const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({msg: 'No hay token, autorizacion denegada' });
    }

    try {
        const token = authHeader.startsWith('Bearer') ? authHeader.slice(7) : authHeader ;

        const cifrado = jwt.verify(token, process.env.JWT_SECRET || 'secreto_gymflow');
        req.usuario = cifrado;
        next();

    } catch (error) {
        res.status(401).json({ msg: 'Token no válido o expirado' });
    }
};