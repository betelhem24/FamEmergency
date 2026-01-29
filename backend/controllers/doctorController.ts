import { Request, Response } from 'express';
import MedicalRecord from '../models/MedicalRecord';
import User from '../models/User';

export const updatePatientRecord = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Patient User ID
        const updateData = req.body;

        // Check if medical record exists, if not create one
        let record = await MedicalRecord.findOne({ userId: id });

        if (record) {
            record = await MedicalRecord.findOneAndUpdate(
                { userId: id },
                { $set: updateData },
                { new: true }
            );
        } else {
            record = new MedicalRecord({
                userId: id,
                ...updateData
            });
            await record.save();
        }

        res.status(200).json({
            success: true,
            message: 'Patient medical record updated successfully',
            data: record
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to update patient record',
            error: error.message
        });
    }
};

export const getPatients = async (req: Request, res: Response) => {
    try {
        const patients = await User.find({ role: 'patient' }).select('-password');
        res.status(200).json({
            success: true,
            data: patients
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patients',
            error: error.message
        });
    }
};
