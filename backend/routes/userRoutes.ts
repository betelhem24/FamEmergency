import { Router } from 'express';
import { getUserWithMedicalData } from '../controllers/userController';

const router = Router();

router.get('/:id', getUserWithMedicalData);

export default router;
