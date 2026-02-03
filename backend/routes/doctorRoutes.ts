import express from 'express';
import { updatePatientRecord, getPatients, getDoctors } from '../controllers/doctorController';
// Assuming there is an auth middleware
// import { protect, restrictTo } from '../middleware/authMiddleware';

const router = express.Router();

// For now, keeping it simple as per instructions.
// Word-by-word: I am using router.put('/update-patient/:id').
router.put('/update-patient/:id', updatePatientRecord);
router.get('/patients', getPatients);
router.get('/list', getDoctors);

export default router;
