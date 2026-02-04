import { Request, Response } from 'express';
import FamilyMember from '../../models/FamilyMember';
import prisma from '../../config/db';

export const addFamilyMember = async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber, relationship } = req.body;
        const userId = (req as any).user.id; // This is a UUID from the token

        if (!email && !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email or phone number'
            });
        }

        // Search user in PostgreSQL using Prisma
        let familyUser;
        if (email) {
            familyUser = await prisma.user.findFirst({
                where: {
                    email: { equals: email, mode: 'insensitive' }
                }
            });
        }

        // Note: Phone number search is not currently supported in the Prisma schema provided in context

        if (!familyUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found with provided email' + (phoneNumber && !email ? ' (search by phone not supported)' : '')
            });
        }

        // Prevent adding yourself
        if (familyUser.id === userId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot add yourself as a family member'
            });
        }

        // Check if already exists in MongoDB relationship collection
        // familyMemberId in MongoDB is now storing the UUID string
        const existing = await FamilyMember.findOne({
            userId,
            familyMemberId: familyUser.id
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'This user is already in your family list'
            });
        }

        const familyMember = new FamilyMember({
            userId,
            familyMemberId: familyUser.id,
            relationship: relationship || 'Family',
            status: 'ACCEPTED'
        });

        await familyMember.save();

        // Construct response manually since we can't populate across DBs
        // We match the structure the frontend expects
        const responseMember = {
            ...familyMember.toObject(),
            familyMemberId: {
                _id: familyUser.id,
                name: familyUser.name,
                email: familyUser.email,
                role: familyUser.role,
                // photo: familyUser.photo // Photo might be in user model but not selected or present, omitting for safety
            }
        };

        res.status(201).json({
            success: true,
            familyMember: responseMember,
            message: 'Family member added successfully'
        });
    } catch (error: any) {
        console.error('Add family member error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search for users to add as family members
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        const userId = (req as any).user.id;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Search in PostgreSQL
        const users = await prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: userId } },
                    {
                        OR: [
                            { email: { contains: query, mode: 'insensitive' } },
                            { name: { contains: query, mode: 'insensitive' } }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
            take: 10
        });

        // Map format to match frontend expectation (frontend expects _id for user in search results)
        const mappedUsers = users.map(u => ({
            _id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            photo: null // Placeholder
        }));

        res.json({ success: true, users: mappedUsers });
    } catch (error: any) {
        console.error('Search users error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
