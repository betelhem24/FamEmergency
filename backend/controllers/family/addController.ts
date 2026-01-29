import { Request, Response } from 'express';
import FamilyMember from '../../models/FamilyMember';
import User from '../../models/User';

export const addFamilyMember = async (req: Request, res: Response) => {
    try {
        const { email, relationship } = req.body;
        const userId = (req as any).user.id;

        const familyUser = await User.findOne({ email });
        if (!familyUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const existing = await FamilyMember.findOne({
            userId,
            familyMemberId: familyUser._id
        });

        if (existing) {
            return res.status(400).json({ success: false, message: 'Family member already added' });
        }

        const familyMember = new FamilyMember({
            userId,
            familyMemberId: familyUser._id,
            relationship: relationship || 'Family',
            status: 'ACCEPTED'
        });

        await familyMember.save();
        res.status(201).json({ success: true, familyMember, message: 'Family member added' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
