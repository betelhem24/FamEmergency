import { Request, Response } from 'express';
import Location from '../../models/Location';
import FamilyMember from '../../models/FamilyMember';

export const getFamilyLocations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const family = await FamilyMember.find({
            userId, status: 'ACCEPTED', 'permissions.canViewLocation': true
        }).populate('familyMemberId', 'name email');

        const locations = await Promise.all(family.map(async (f) => {
            const loc = await Location.findOne({ userId: f.familyMemberId })
                .sort({ timestamp: -1 }).limit(1);
            return { memberId: f.familyMemberId, location: loc };
        }));

        res.json({ success: true, locations });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyLocation = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const location = await Location.findOne({ userId }).sort({ timestamp: -1 }).limit(1);
        res.json({ success: true, location });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
