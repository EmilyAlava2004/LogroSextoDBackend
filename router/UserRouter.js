import express from 'express';
import { 
  login, 
  updateUsersPassword, 
  updateUsersEmail, 
  getUsers, 
  updateUsers, 
  getOneUser 
} from '../controller/UserController.js';
import { verifyToken } from '../middleware/auth.js';
import { 
  validateRegister, 
  validateLogin, 
  validateUpdateUser, 
  validateUpdateEmail, 
  validateUpdatePassword 
} from '../middleware/validatorMiddleware.js';
import { registerUser } from '../controller/AuthController.js';

const router = express.Router();

// Rutas públicas
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, login);

// Rutas protegidas
router.get('/user', verifyToken, getUsers);
router.get('/user/:id', verifyToken, getOneUser);
router.put('/user/:id', verifyToken, validateUpdateUser, updateUsers);
router.put('/user/email/:id', verifyToken, validateUpdateEmail, updateUsersEmail);
router.put('/user/password/:id', verifyToken, validateUpdatePassword, updateUsersPassword);

export const RouterUsuer = router;