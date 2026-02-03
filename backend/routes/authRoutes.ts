import express from 'express';
import { register, login } from '../controllers/authController';
import { updateTheme } from '../controllers/themeController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// POST /api/auth/register - User registration (Neon-Primary)
router.post('/register', register);

// POST /api/auth/login - User login (Neon-Primary)
router.post('/login', login);

// PUT /api/auth/theme - Update user theme preference
router.put('/theme', authMiddleware, updateTheme);

export default router;