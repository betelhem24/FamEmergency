import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db'; // Using the central db config

import MongoUser from '../models/User'; // Import MongoDB User model

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase();

    // REQUIREMENT: Check live database (Neon)
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Identity Node already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // REQUIREMENT: Every new user must be visible in the Neon console
    const userCount = await prisma.user.count();
    const newUserRole = role || 'PATIENT';
    const neonId = `user_${Date.now()}_${userCount}`;
    console.log('DEBUG: Creating Neon User with ID:', neonId);
    console.log('DEBUG: Create Data:', JSON.stringify({
      id: neonId,
      name,
      email: normalizedEmail,
      role: newUserRole
    }, null, 2));

    // 1. Save to Neon PostgreSQL
    const user = await prisma.user.create({
      data: {
        id: neonId,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: newUserRole,
        medicalRecord: newUserRole === 'PATIENT' ? {
          create: {
            id: `mr_${Date.now()}`,
            fullName: name,
            allergies: [],
            conditions: []
          }
        } : undefined
      }
    });

    // 2. Save to MongoDB Atlas (Dual Write)
    try {
      // Check if user exists in Mongo to match behavior (though unlikely if not in Postgres)
      const existingMongoUser = await MongoUser.findOne({ email: normalizedEmail });
      if (!existingMongoUser) {
        const mongoUser = new MongoUser({
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role: newUserRole === 'PATIENT' ? 'patient' : 'doctor'
        });
        await mongoUser.save();
        console.log(`[SUCCESS] User synced to MongoDB: ${normalizedEmail}`);
      }
    } catch (mongoError) {
      console.error('MongoDB Sync Warning:', mongoError);
      // We don't fail the request if Mongo fails, but we log it.
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: { id: user.id, name, email: normalizedEmail, role: user.role }
    });

  } catch (error: any) {
    console.error('Registration Error:', error);
    if (error.code === 'P1001' || error.code === 'P1017') {
      return res.status(503).json({ message: 'Database connection unavailable. Please try again.' });
    }
    res.status(500).json({ message: 'Neural link failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid identity credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid identity credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    if (error.code === 'P1001' || error.code === 'P1017') {
      return res.status(503).json({ message: 'Database connection unavailable. Please try again.' });
    }
    res.status(500).json({ message: 'Neural access denied' });
  }
};