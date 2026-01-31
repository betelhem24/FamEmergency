import { Request, Response } from 'express';
import prisma from '../config/db';

export const getUserWithMedicalData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // REQUIREMENT: Connect to live database (Neon)
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
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
