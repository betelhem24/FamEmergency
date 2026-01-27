import express from 'express';
import { registerUser, loginUser } from '../controllers/authController'; // I added loginUser here

const router = express.Router();

// I am keeping the registration route
router.post('/register', registerUser);

// I am adding the new login route
router.post('/login', loginUser);

export default router;