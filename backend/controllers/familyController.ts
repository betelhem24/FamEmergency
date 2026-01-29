import { Request, Response } from 'express';
import FamilyMember from '../models/FamilyMember';
import User from '../models/User';

export const addFamilyMember = async (req: Request, res: Response) => {
    try {
        const { email, relationship } = req.body;
        const userId = (req as any).user.id;

        // Find family member by email
        const familyUser = await User.findOne({ email });

        if (!familyUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if already added
        const existing = await FamilyMember.findOne({
            userId,
            familyMemberId: familyUser._id
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Family member already added'
            });
        }

        const familyMember = new FamilyMember({
            userId,
            familyMemberId: familyUser._id,
            relationship: relationship || 'Family',
            status: 'ACCEPTED'
        });

        await familyMember.save();

        res.status(201).json({
            success: true,
            familyMember,
            message: 'Family member added successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getFamilyMembers = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const family = await FamilyMember.find({
            userId,
            status: 'ACCEPTED'
        }).populate('familyMemberId', 'name email role');

        res.json({ success: true, family });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const removeFamilyMember = async (req: Request, res: Response) => {
    try {
        const { memberId } = req.params;
        const userId = (req as any).user.id;

        await FamilyMember.findOneAndDelete({
            userId,
            _id: memberId
        });

        res.json({
            success: true,
            message: 'Family member removed'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
