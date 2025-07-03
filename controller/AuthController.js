import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';
import { TOKEN_KEY } from '../config/config.js';

export const registerUser = async (req, res) => {
  const { user, email, password, numero } = req.body;

  try {
    // Validación: correo ya registrado
    const usuarioExistente = await UserModel.findOne({ where: { email: email.toLowerCase() } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password.toString(), 10);

    // Crear nuevo usuario
    const nuevoUsuario = await UserModel.create({
      user,
      email: email.toLowerCase(),
      password: hash,
      numero,
      state: true // Asegurar que el usuario esté activo por defecto
    });

    // Generar token JWT
    const token = jwt.sign(
      { user_id: nuevoUsuario.id, email: nuevoUsuario.email },
      TOKEN_KEY,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa
    return res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      dataUser: {
        id: nuevoUsuario.id,
        user: nuevoUsuario.user,
        email: nuevoUsuario.email,
        numero: nuevoUsuario.numero
      },
      token
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor', error: error.message });
  }
};