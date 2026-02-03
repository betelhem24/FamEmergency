import { Request, Response } from 'express';
import prisma from '../config/db';
import MongoUser from '../models/User';

export const getUserWithMedicalData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (typeof id !== 'string') {
            return res.status(400).json({ message: 'Invalid Identity Identifier' });
        }

        // REQUIREMENT: Connect to live database (Neon)
        const user = await (prisma.user as any).findUnique({
            where: { id },
            include: {
                medicalRecord: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Patient Not Found.' });
        }

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Identity retrieval error' });
    }
};

export const updateThemePreference = async (req: Request, res: Response) => {
    try {
        const { theme } = req.body;
        const userId = (req as any).user.id;

        if (!['light', 'dark', 'blue'].includes(theme)) {
            return res.status(400).json({ message: 'Invalid theme selection' });
        }

        // 1. Update Neon
        await prisma.user.update({
            where: { id: userId },
            data: { theme }
        });

        // 2. Update MongoDB
        try {
            await MongoUser.findByIdAndUpdate(userId, { theme });
        } catch (mongoError) {
            console.error('MongoDB Theme Sync Warning:', mongoError);
        }

        res.json({ success: true, theme });
    } catch (error: any) {
        console.error('Theme update error:', error);
        res.status(500).json({ message: 'Failed to persist theme preference' });
    }
};
