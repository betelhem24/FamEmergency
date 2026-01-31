import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

// POST /api/auth/register - User registration (Neon-Primary)
router.post('/register', register);

// POST /api/auth/login - User login (Neon-Primary)
router.post('/login', login);

export default router;