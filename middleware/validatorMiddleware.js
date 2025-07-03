import { body, validationResult } from 'express-validator';

// Register validation
export const validateRegister = [
  body('user').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Correo no válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('numero').notEmpty().withMessage('El número es obligatorio'),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  }
];

// Login validation (opcional, pero recomendado)
export const validateLogin = [
  body('email').isEmail().withMessage('Correo no válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  }
];

// Update user validation
export const validateUpdateUser = [
  body('user').notEmpty().withMessage('El nombre es obligatorio'),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  }
];

// Update email validation
export const validateUpdateEmail = [
  body('email').isEmail().withMessage('Correo no válido'),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  }
];

// Update password validation
export const validateUpdatePassword = [
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  }
];