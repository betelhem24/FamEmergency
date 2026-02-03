import { Request, Response } from 'express';
import MedicalRecord from '../../models/MedicalRecord';
import prisma from '../../config/db';

export const createRecord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, fullName, age, gender, dob, familyPhone, bloodType, height, weight, allergies, conditions, medications, contacts, images } = req.body;

        // 1. Dual-DB Sync: Save to MongoDB
        let record = await MedicalRecord.findOne({ userId });
        if (record) {
            Object.assign(record, { fullName, age: Number(age), gender, dob, familyPhone, bloodType, height, weight, allergies, conditions, medications, contacts, images });
            await record.save();
        } else {
            record = new MedicalRecord({ userId, fullName, age: Number(age), gender, dob, familyPhone, bloodType, height, weight, allergies, conditions, medications, contacts, images });
            await record.save();
        }

        // 2. Dual-DB Sync: Save to Neon (PostgreSQL via Prisma)
        try {
            await prisma.medicalRecord.upsert({
                where: { userId },
                update: {
                    fullName,
                    age: age ? Number(age) : 0,
                    gender,
                    dob,
                    familyPhone,
                    bloodType,
                    height,
                    weight,
                    allergies: allergies || [],
                    conditions: conditions || [],
                    medications: medications || [],
                    images: images || [],
                },
                create: {
                    id: `mr_${Date.now()}`,
                    userId,
                    fullName,
                    age: age ? Number(age) : 0,
                    gender,
                    dob,
                    familyPhone,
                    bloodType,
                    height,
                    weight,
                    allergies: allergies || [],
                    conditions: conditions || [],
                    medications: medications || [],
                    images: images || [],
                },
            });

            // Sync contacts to EmergencyContact model in Prisma if provided
            if (contacts && Array.isArray(contacts)) {
                // Delete old ones and re-insert for simplicity in sync
                await prisma.emergencyContact.deleteMany({ where: { userId } });
                await prisma.emergencyContact.createMany({
                    data: contacts.map((c: any) => ({
                        userId,
                        name: c.name,
                        phone: c.phone,
                        relation: c.relationship
                    }))
                });
            }
            console.log(`[SYNC] Medical Record and Contacts synced to PostgreSQL for user: ${userId}`);
        } catch (prismaError) {
            console.error('[SYNC_ERROR] Prisma sync failed:', prismaError);
            // We don't fail the whole request because MongoDB succeeded, but we log it
        }

        res.status(200).json({ message: 'Medical Record saved and synced', record });
    } catch (error) {
        console.error('Error saving record:', error);
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
