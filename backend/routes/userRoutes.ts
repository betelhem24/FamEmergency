import { Router } from 'express';
import { getUserWithMedicalData, updateThemePreference } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/:id', getUserWithMedicalData);
router.put('/theme', authMiddleware, updateThemePreference);

export default router;
