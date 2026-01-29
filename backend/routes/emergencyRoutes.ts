import express from 'express';
import { triggerEmergency } from '../controllers/emergency/triggerController';
import { getActiveEmergencies, cancelEmergency } from '../controllers/emergency/manageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// POST /api/emergency/trigger - Trigger emergency alert
router.post('/trigger', triggerEmergency);

// GET /api/emergency/active - Get active emergencies
router.get('/active', getActiveEmergencies);

// PUT /api/emergency/:emergencyId/cancel - Cancel emergency
router.put('/:emergencyId/cancel', cancelEmergency);

export default router;
