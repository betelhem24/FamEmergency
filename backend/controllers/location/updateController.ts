import { Request, Response } from 'express';
import Location from '../../models/Location';

export const updateLocation = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, accuracy } = req.body;
        const userId = (req as any).user.id;

        const location = new Location({
            userId,
            latitude,
            longitude,
            accuracy: accuracy || 0,
            isTracking: true
        });

        await location.save();
        res.json({ success: true, location, message: 'Location updated successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
