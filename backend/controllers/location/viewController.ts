import { Request, Response } from 'express';
import Location from '../../models/Location';
import FamilyMember from '../../models/FamilyMember';
import prisma from '../../config/db';

export const getFamilyLocations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const family = await FamilyMember.find({
            userId, status: 'ACCEPTED', 'permissions.canViewLocation': true
        });

        // Collect all familyMemberIds (which are Prisma User IDs)
        const familyMemberIds = family.map(f => f.familyMemberId).filter(Boolean);

        // Fetch user details from Prisma
        const familyUsers = await prisma.user.findMany({
            where: {
                id: { in: familyMemberIds as string[] }
            },
            select: {
                id: true,
                name: true,
                email: true,
                // photo: true, // Photo might not be in Prisma User model yet based on previous errors
                role: true
            }
        });

        // Create a map for quick access
        const userMap = new Map(familyUsers.map(u => [u.id, u]));

        const locations = await Promise.all(family.map(async (f: any) => {
            const familyUserId = f.familyMemberId.toString();
            const userDetails = userMap.get(familyUserId);

            if (!userDetails) return null; // Skip if user not found in Postgres

            const loc = await Location.findOne({ userId: familyUserId })
                .sort({ timestamp: -1 }).limit(1);

            return {
                _id: familyUserId, // Use the real User ID
                name: userDetails.name,
                email: userDetails.email,
                photo: null, // Placeholder as photo might be missing
                role: userDetails.role,
                relationship: f.relationship,
                location: loc ? {
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    accuracy: loc.accuracy,
                    timestamp: loc.timestamp
                } : null,
                // Include health metrics from location data or defaults
                heartRate: (loc as any)?.heartRate || 72,
                batteryLevel: (loc as any)?.batteryLevel || 85
            };
        }));

        // Filter out nulls
        const validLocations = locations.filter(l => l !== null);

        res.json({ success: true, locations: validLocations });
    } catch (error: any) {
        console.error('Get family locations error:', error);
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
