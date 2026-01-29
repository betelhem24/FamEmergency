import { Request, Response } from 'express';
import MedicalRecord from '../../models/MedicalRecord';

export const createRecord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, fullName, dob, bloodType, height, weight, allergies, conditions, medications, contacts } = req.body;
        let record = await MedicalRecord.findOne({ userId });

        if (record) {
            Object.assign(record, { fullName, dob, bloodType, height, weight, allergies, conditions, medications, contacts });
            await record.save();
        } else {
            record = new MedicalRecord({ userId, fullName, dob, bloodType, height, weight, allergies, conditions, medications, contacts });
            await record.save();
        }
        res.status(200).json({ message: 'Medical Record saved', record });
    } catch (error) {
        res.status(500).json({ message: 'Server error saving record' });
    }
};

export const getRecordByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const record = await MedicalRecord.findOne({ userId });
        res.status(200).json(record || null);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching record' });
    }
};

export const getRecord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const record = await MedicalRecord.findById(id);
        if (!record) { res.status(404).json({ message: 'Record not found' }); return; }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching record' });
    }
};
