import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';
import { TOKEN_KEY } from '../config/config.js';

export const registerUser = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    // Validación: correo ya registrado
    const usuarioExistente = await UserModel.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(contraseña, 10);

    // Crear nuevo usuario
    const nuevoUsuario = await UserModel.create({
      nombre,
      correo,
      contraseña: hash
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: nuevoUsuario.id, correo: nuevoUsuario.correo },
      TOKEN_KEY,
      { expiresIn: '2h' }
    );

    // Respuesta exitosa
    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo
      },
      token
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};