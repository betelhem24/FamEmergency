import { Request, Response } from 'express';
import FamilyMember from '../../models/FamilyMember';
import prisma from '../../config/db';

export const getFamilyMembers = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        // 1. Get relationships from MongoDB
        const relationships = await FamilyMember.find({ userId, status: 'ACCEPTED' });

        if (!relationships.length) {
            return res.json({ success: true, family: [] });
        }

        // 2. Get user details from PostgreSQL
        const memberIds = relationships.map(r => r.familyMemberId);
        const users = await prisma.user.findMany({
            where: {
                id: { in: memberIds }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        // 3. Merge data
        const family = relationships.map(rel => {
            const user = users.find(u => u.id === rel.familyMemberId);
            return {
                ...rel.toObject(),
                familyMemberId: user ? {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                } : null
            };
        }).filter(item => item.familyMemberId !== null);

        res.json({ success: true, family });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFamilyByUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const relationships = await FamilyMember.find({ userId, status: 'ACCEPTED' });

        if (!relationships.length) {
            return res.json({ success: true, family: [] });
        }

        const memberIds = relationships.map(r => r.familyMemberId);
        const users = await prisma.user.findMany({
            where: {
                id: { in: memberIds }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        const family = relationships.map(rel => {
            const user = users.find(u => u.id === rel.familyMemberId);
            return {
                ...rel.toObject(),
                familyMemberId: user ? {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                } : null
            };
        }).filter(item => item.familyMemberId !== null);

        res.json({ success: true, family });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeFamilyMember = async (req: Request, res: Response) => {
    try {
        const { memberId } = req.params;
        const userId = (req as any).user.id;

        await FamilyMember.findOneAndDelete({ userId, familyMemberId: memberId });
        res.json({ success: true, message: 'Family member removed' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
