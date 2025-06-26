import express from 'express';
// import { login,updateUsersPassword, updateUsersEmail, getUsers,updateUsers,deleteUsers,getOneUser} from '../controller/UserController.js';
import  {verifyToken}  from '../middleware/auth.js';
const rotuer = express.Router();
// rotuer.get('/user',verifyToken, getUsers);
// rotuer.get('/user/:id',verifyToken, getOneUser);

// router.post('/register', [
//   body('name').notEmpty().withMessage('El nombre es obligatorio'),
//   body('email').isEmail().withMessage('Correo inválido'),
//   body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres')
// ], runValidations, register);

// rotuer.put('/user/:id',verifyToken, updateUsers);
// rotuer.delete('/user/:id', verifyToken, deleteUsers);
// rotuer.post('/login',login);
// rotuer.put('/user/email/:id',verifyToken, updateUsersEmail);
// rotuer.put('/user/password/:id',verifyToken, updateUsersPassword);
export const RouterUsuer = rotuer;

