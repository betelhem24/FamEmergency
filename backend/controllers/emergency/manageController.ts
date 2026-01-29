import { Request, Response } from 'express';
import Emergency from '../../models/Emergency';

export const getActiveEmergencies = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const emergencies = await Emergency.find({ userId, status: 'ACTIVE' })
            .sort({ triggeredAt: -1 });

        res.json({ success: true, emergencies });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const cancelEmergency = async (req: Request, res: Response) => {
    try {
        const { emergencyId } = req.params;
        const userId = (req as any).user.id;

        const emergency = await Emergency.findOneAndUpdate(
            { _id: emergencyId, userId },
            { status: 'CANCELLED', resolvedAt: new Date() },
            { new: true }
        );

        if (!emergency) {
            return res.status(404).json({ success: false, message: 'Emergency not found' });
        }

        res.json({ success: true, emergency });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
