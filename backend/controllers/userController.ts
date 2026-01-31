import { Request, Response } from 'express';
import prisma from '../config/db';

export const getUserWithMedicalData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (typeof id !== 'string') {
            return res.status(400).json({ message: 'Invalid Identity Identifier' });
        }

        // REQUIREMENT: Connect to live database (Neon)
        // We use type assertion for the include block to bypass IDE desync with Prisma Client
        const user = await (prisma.user as any).findUnique({
            where: { id },
            include: {
                medicalRecord: true
            }
        });

        if (!user) {
            // REQUIREMENT: If the ID is wrong, show "Patient Not Found."
            return res.status(404).json({ message: 'Patient Not Found.' });
        }

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: 'Identity retrieval error' });
    }
};
