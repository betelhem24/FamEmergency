import { Request, Response } from 'express';
import FamilyMember from '../../models/FamilyMember';

export const getFamilyMembers = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const family = await FamilyMember.find({ userId, status: 'ACCEPTED' })
            .populate('familyMemberId', 'name email role');

        res.json({ success: true, family });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFamilyByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const family = await FamilyMember.find({ userId, status: 'ACCEPTED' })
            .populate('familyMemberId', 'name email role');

        res.json({ success: true, family });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeFamilyMember = async (req: Request, res: Response) => {
    try {
        const { memberId } = req.params;
        const userId = (req as any).user.id;

        await FamilyMember.findOneAndDelete({ userId, _id: memberId });
        res.json({ success: true, message: 'Family member removed' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
