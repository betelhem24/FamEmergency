import { Request, Response } from 'express';
import Emergency from '../models/Emergency';
import FamilyMember from '../models/FamilyMember';

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

        // Get family members to notify
        const family = await FamilyMember.find({
            userId,
            status: 'ACCEPTED',
            'permissions.canReceiveEmergency': true
        });

        const responders = family.map(member => ({
            userId: member.familyMemberId,
            status: 'NOTIFIED' as const,
            timestamp: new Date()
        }));

        emergency.responders = responders;
        await emergency.save();

        res.status(201).json({
            success: true,
            emergency,
            message: 'Emergency triggered successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getActiveEmergencies = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const emergencies = await Emergency.find({
            userId,
            status: 'ACTIVE'
        }).sort({ triggeredAt: -1 });

        res.json({ success: true, emergencies });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
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
            return res.status(404).json({
                success: false,
                message: 'Emergency not found'
            });
        }

        res.json({ success: true, emergency });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
