import express from 'express';
// I changed 'registerUser' to 'register' and 'loginUser' to 'login'
import { register, login } from '../controllers/authController';

const router = express.Router();

// I link the /register path to the register function
router.post('/register', register);

// I link the /login path to the login function
router.post('/login', login);

export default router;