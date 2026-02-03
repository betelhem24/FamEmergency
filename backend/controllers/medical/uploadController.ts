import { Request, Response } from 'express';
import MedicalRecord from '../../models/MedicalRecord';
import prisma from '../../config/db';

export const uploadMedicalImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;
        const { title } = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const imageUrl = `/uploads/medical/${file.filename}`;
        const imageId = `img_${Date.now()}`;
        const newImage = {
            id: imageId,
            url: imageUrl,
            title: title || 'Medical Scan',
            uploadedAt: new Date().toISOString()
        };

        // 1. Update MongoDB
        const mongoRecord = await MedicalRecord.findOneAndUpdate(
            { userId },
            { $push: { images: newImage } },
            { new: true, upsert: true }
        );

        // 2. Dual-DB Sync: Update Neon (PostgreSQL via Prisma)
        try {
            // @ts-ignore
            const currentPrismaRecord = await prisma.medicalRecord.findUnique({
                where: { userId }
            });

            // @ts-ignore
            const updatedImages = [...(currentPrismaRecord?.images as any[] || []), newImage];

            // @ts-ignore
            await prisma.medicalRecord.update({
                where: { userId },
                data: {
                    images: updatedImages
                }
            });
            console.log(`[SYNC] Medical image linked to PostgreSQL for user: ${userId}`);
        } catch (prismaError) {
            console.error('[SYNC_ERROR] Prisma image sync failed:', prismaError);
        }

        res.status(200).json({
            message: 'Image uploaded and linked successfully',
            image: newImage,
            record: mongoRecord
        });
    } catch (error) {
        console.error('Error uploading medical image:', error);
        res.status(500).json({ message: 'Server error uploading image' });
    }
};
