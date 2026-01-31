import { Request, Response } from 'express';
import User from '../models/User';
import MedicalRecord from '../models/MedicalRecord';

export const getUserWithMedicalData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // Check if ID is valid MongoDB ID to avoid crash
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const medicalRecord = await MedicalRecord.findOne({ userId: id });

        res.json({
            user,
            medicalRecord: medicalRecord || null
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
