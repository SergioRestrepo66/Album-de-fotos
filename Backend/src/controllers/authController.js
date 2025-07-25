const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'Clave_segura_para_jwt';

// Registro de usuario
exports.register = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);
        const emailExistente = await Usuario.findOne({ email: req.body.email });
        if (emailExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const nuevoUsuario = new Usuario({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        const usuarioGuardado = await nuevoUsuario.save();
        res.json({ data: usuarioGuardado });
    } catch (err) {
        console.log('Error en el servidor:', err);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Validación básica
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email y contraseña son requeridos' 
            });
        }
    
        const usuario = await Usuario.findOne({ email });
    
        if (!usuario) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas' 
            });
        }
    
        const contraseñaValida = await bcrypt.compare(password, usuario.password);
    
        if (!contraseñaValida) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas' 
            });
        }
        // Crear token JWT
        const token = jwt.sign(
            {id: usuario._id, email: usuario.email }, process.env.JWT_SECRET || JWT_SECRET, { expiresIn: '1h' }
        );

        // Solo mensaje y token
        res.status(200).json({ 
            mensaje: 'Inicio de sesión exitoso',
            token
        });
    } catch (err) {
        console.error('Error en el Login:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
}