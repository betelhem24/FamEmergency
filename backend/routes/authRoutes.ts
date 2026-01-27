import express from 'express';
import { register } from '../controllers/authController'; // I import the register function I just wrote

const router = express.Router();

// I create a POST route for registration
// The full URL will be: http://localhost:5000/api/auth/register
router.post('/register', register);

export default router;