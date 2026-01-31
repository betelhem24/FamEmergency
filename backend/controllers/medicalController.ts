import { Request, Response } from 'express';
import MedicalRecord from '../models/MedicalRecord';

// POST /api/medical
export const createRecord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, fullName, dob, bloodType, height, weight, allergies, conditions, medications, contacts } = req.body;

        let record = await MedicalRecord.findOne({ userId });

        if (record) {
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
            record = new MedicalRecord({
                userId, fullName, dob, bloodType, height, weight, allergies, conditions, medications, contacts
            });
            await record.save();
        }

        res.status(200).json({
            success: true,
            message: 'MEDICAL_RECORD_SYNC_SUCCESS',
            data: record
        });
    } catch (error: any) {
        console.error('BACKEND_ERROR: Medical Save Failure', error);
        res.status(500).json({
            success: false,
            message: 'INTERNAL_SERVER_ERROR',
            error: error.message
        });
    }
};

// GET /api/medical/user/:userId
export const getRecordByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const record = await MedicalRecord.findOne({ userId });

        res.status(200).json({
            success: true,
            data: record || null
        });
    } catch (error: any) {
        console.error('BACKEND_ERROR: Medical Fetch Failure', error);
        res.status(500).json({
            success: false,
            message: 'FETCH_ERROR',
            error: error.message
        });
    }
};

// GET /api/medical/:id
export const getRecord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const record = await MedicalRecord.findById(id);

        if (!record) {
            res.status(404).json({
                success: false,
                message: 'RECORD_NOT_FOUND'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: record
        });
    } catch (error: any) {
        console.error('BACKEND_ERROR: ID Lookup Failure', error);
        res.status(500).json({
            success: false,
            message: 'INVALID_RECORD_ID',
            error: error.message
        });
    }
};
