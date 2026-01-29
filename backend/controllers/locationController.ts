import { Request, Response } from 'express';
import Location from '../models/Location';
import FamilyMember from '../models/FamilyMember';

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

        res.json({
            success: true,
            location,
            message: 'Location updated successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getFamilyLocations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        // Get family members with location permission
        const family = await FamilyMember.find({
            userId,
            status: 'ACCEPTED',
            'permissions.canViewLocation': true
        }).populate('familyMemberId', 'name email');

        // Get latest location for each family member
        const familyIds = family.map(f => f.familyMemberId);

        const locations = await Promise.all(
            familyIds.map(async (memberId) => {
                const loc = await Location.findOne({ userId: memberId })
                    .sort({ timestamp: -1 })
                    .limit(1);
                return { memberId, location: loc };
            })
        );

        res.json({ success: true, locations });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMyLocation = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const location = await Location.findOne({ userId })
            .sort({ timestamp: -1 })
            .limit(1);

        res.json({ success: true, location });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
