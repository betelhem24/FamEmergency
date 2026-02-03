import { Request, Response } from 'express';
import prisma from '../config/db';
import MongoUser from '../models/User';

export const updateTheme = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { theme } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!['light', 'dark', 'blue'].includes(theme)) {
            return res.status(400).json({ message: 'Invalid theme value' });
        }

        // Update in Neon (PostgreSQL)
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { theme }
        });

        // Update in MongoDB
        try {
            await MongoUser.findByIdAndUpdate(userId, { theme });
            console.log(`[SUCCESS] Theme updated in both databases: ${theme}`);
        } catch (mongoError) {
            console.error('MongoDB theme update warning:', mongoError);
        }

        res.status(200).json({
            success: true,
            message: 'Theme updated successfully',
            theme: updatedUser.theme
        });
    } catch (error) {
        console.error('Theme update error:', error);
        res.status(500).json({ message: 'Server error updating theme' });
    }
};
