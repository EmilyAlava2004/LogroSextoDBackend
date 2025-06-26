import rateLimit from 'express-rate-limit';

export default rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de peticiones
  message: 'Demasiadas peticiones desde esta IP, intenta más tarde.'
});