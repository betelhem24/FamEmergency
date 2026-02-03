import express from 'express';
import { createRecord, getRecord, getRecordByUser } from '../controllers/medical/manageController';
import { getPatients } from '../controllers/medical/patientController';
import { uploadMedicalImage } from '../controllers/medical/uploadController';
import { upload } from '../utils/upload';
import { getPatientQRCode } from '../controllers/medical/qrController';

const router = express.Router();

// Route to save or update a record
router.post('/', createRecord);

// Route to update a record (for doctors)
router.put('/user/:userId', createRecord); // We can reuse createRecord as it handles upsert

// Route to get all patients (for Doctor Dashboard)
router.get('/patients', getPatients);

// Route to get a record by user ID (for Profile Tab)
router.get('/user/:userId', getRecordByUser);

// Route to get a record by ID (for QR scan)
router.get('/:id', getRecord);

// Route to upload a medical image
router.post('/upload', upload.single('image'), uploadMedicalImage);

// Route to generate patient QR code
router.get('/qr/:userId', getPatientQRCode);

export default router;
