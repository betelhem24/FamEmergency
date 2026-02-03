import { Request, Response } from 'express';
import prisma from '../../config/db';

export const getPatients = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, department } = req.query;

        const patients = await prisma.user.findMany({
            where: {
                role: 'PATIENT',
                AND: [
                    search ? {
                        OR: [
                            { name: { contains: search as string, mode: 'insensitive' } },
                            { email: { contains: search as string, mode: 'insensitive' } }
                        ]
                    } : {},
                    department ? { department: department as string } : {}
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                createdAt: true
            }
        });

        res.status(200).json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server error fetching patients' });
    }
};
