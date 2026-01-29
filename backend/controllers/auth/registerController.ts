import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import prisma from '../../db/prisma';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const mongoUser = new User({ name, email: normalizedEmail, password: hashedPassword, role });
        await mongoUser.save();

        try {
            await prisma.user.create({
                data: {
                    id: mongoUser._id.toString(),
                    name,
                    email: normalizedEmail,
                    password: hashedPassword,
                    role: role.toUpperCase() as any,
                    createdAt: new Date()
                }
            });
        } catch (sqlError) {
            console.error('SQL Sync Error (non-fatal):', sqlError);
        }

        const token = jwt.sign(
            { userId: mongoUser._id, role: mongoUser.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        res.status(201).json({
            token,
            user: { id: mongoUser._id, name, email: normalizedEmail, role }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Something went wrong during registration' });
    }
};
