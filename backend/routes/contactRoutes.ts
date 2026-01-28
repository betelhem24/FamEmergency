import { Router } from 'express';
import { addContact } from '../controllers/contactController';
// I point to the middleware folder. 
import { protect } from '../middleware/authMiddleware'; 

const router = Router();

router.post('/add', protect, addContact);

export default router;