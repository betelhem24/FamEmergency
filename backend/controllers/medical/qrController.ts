import { Request, Response } from 'express';
import MedicalRecord from '../../models/MedicalRecord';
import prisma from '../../config/db';
import { generatePatientQR } from '../../utils/qrGenerator';

export const getPatientQRCode = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        // Fetch medical record from MongoDB
        const record = await MedicalRecord.findOne({ userId });

        if (!record) {
            res.status(404).json({ message: 'Medical record not found' });
            return;
        }

        // Fetch user data from Prisma
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Calculate age from DOB
        let age = 0;
        if (record.dob) {
            const birthDate = new Date(record.dob);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        // Prepare QR data
        const qrData = {
            id: userId,
            name: record.fullName || user.name,
            age: age || undefined,
            bloodType: record.bloodType || 'Unknown',
            allergies: record.allergies || [],
            conditions: record.conditions || [],
            medications: record.medications || [],
            emergencyContacts: (record.contacts || []).map((contact: any) => ({
                name: contact.name,
                phone: contact.phone,
                relationship: contact.relationship
            }))
        };

        // Generate QR code
        const qrCodeDataURL = await generatePatientQR(qrData);

        res.status(200).json({
            success: true,
            qrCode: qrCodeDataURL,
            data: qrData
        });
    } catch (error) {
        console.error('Error generating patient QR code:', error);
        res.status(500).json({ message: 'Server error generating QR code' });
    }
};
