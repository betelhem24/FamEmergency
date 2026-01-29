import express from 'express';
import { updateLocation } from '../controllers/location/updateController';
import { getFamilyLocations, getMyLocation } from '../controllers/location/viewController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

// POST /api/location/update - Update user location
router.post('/update', updateLocation);

// GET /api/location/family - Get family locations
router.get('/family', getFamilyLocations);

// GET /api/location/me - Get my latest location
router.get('/me', getMyLocation);

export default router;
