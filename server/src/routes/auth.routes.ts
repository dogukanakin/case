import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  changePassword 
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Express route handler tiplemesi için RequestHandler kullanımı
router.post('/register', registerUser as express.RequestHandler);
router.post('/login', loginUser as express.RequestHandler);

// Protected routes
router.get('/profile', protect as express.RequestHandler, getUserProfile as express.RequestHandler);
router.put('/change-password', protect as express.RequestHandler, changePassword as express.RequestHandler);

export default router; 