import { Request, Response } from 'express';
import MedicalRecord from '../models/MedicalRecord';

// POST /api/medical
// Create or Update medical record for a user
export const createRecord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, fullName, dob, bloodType, height, weight, allergies, conditions, medications, contacts } = req.body;

        // Upsert: Try to find existing record for this user first
        let record = await MedicalRecord.findOne({ userId });

        if (record) {
            // Update existing
            record.fullName = fullName;
            record.dob = dob;
            record.bloodType = bloodType;
            record.height = height;
            record.weight = weight;
            record.allergies = allergies;
            record.conditions = conditions;
            record.medications = medications;
            record.contacts = contacts;
            await record.save();
        } else {
            // Create new
            record = new MedicalRecord({
                userId,
                fullName,
                dob,
                bloodType,
                height,
                weight,
                allergies,
                conditions,
                medications,
                contacts
            });
            await record.save();
        }

        res.status(200).json({
            message: 'Medical Record saved successfully',
            record
        });
    } catch (error) {
        console.error('Error saving medical record:', error);
        res.status(500).json({ message: 'Server error saving record' });
    }
};

// GET /api/medical/user/:userId
// Fetch record by User ID (for Profile Tab)
export const getRecordByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const record = await MedicalRecord.findOne({ userId });

        // Return null or empty object if not found, don't 404
        res.status(200).json(record || null);
    } catch (error) {
        console.error('Error fetching medical record:', error);
        res.status(500).json({ message: 'Server error fetching record' });
    }
};

// GET /api/medical/:id
// Fetch by Record ID (for QR Scanner)
export const getRecord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const record = await MedicalRecord.findById(id);

        if (!record) {
            res.status(404).json({ message: 'Medical Record not found' });
            return;
        }

        res.status(200).json(record);
    } catch (error) {
        console.error('Error fetching medical record:', error);
        res.status(500).json({ message: 'Server error fetching record' });
    }
};
