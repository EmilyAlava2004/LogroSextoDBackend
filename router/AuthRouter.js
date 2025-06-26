import { Router } from 'express';
import { registerUser } from '../controller/AuthController.js';
import { validateRegister } from '../middleware/validatorMiddleware.js';
import rateLimit from '../middleware/ratelimiter.js';

const router = Router();

// router.post('/register', rateLimit, validateRegister, registerUser);
router.post('/register', (req, res) => {
  res.json({ message: 'Registro funcionando' });
});

export default router;