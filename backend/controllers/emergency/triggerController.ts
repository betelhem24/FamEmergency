import { Request, Response } from 'express';
import Emergency from '../../models/Emergency';
import FamilyMember from '../../models/FamilyMember';

export const triggerEmergency = async (req: Request, res: Response) => {
    try {
        const { type, severity, location, notes } = req.body;
        const userId = (req as any).user.id;

        const emergency = new Emergency({
            userId,
            type: type || 'SOS',
            severity: severity || 'CRITICAL',
            location,
            notes,
            status: 'ACTIVE'
        });

        await emergency.save();

        const family = await FamilyMember.find({
            userId,
            status: 'ACCEPTED',
            'permissions.canReceiveEmergency': true
        });

        emergency.responders = family.map(member => ({
            userId: member.familyMemberId,
            status: 'NOTIFIED' as const,
            timestamp: new Date()
        }));

        await emergency.save();

        res.status(201).json({
            success: true,
            emergency,
            message: 'Emergency triggered successfully'
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
