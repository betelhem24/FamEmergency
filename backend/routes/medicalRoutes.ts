import express from 'express';
import { createRecord, getRecord, getRecordByUser } from '../controllers/medical/manageController';

const router = express.Router();

// Route to save or update a record
router.post('/', createRecord);

// Route to get a record by user ID (for Profile Tab)
router.get('/user/:userId', getRecordByUser);

// Route to get a record by ID (for QR scan)
router.get('/:id', getRecord);

export default router;
