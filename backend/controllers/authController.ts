import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db'; // Using the central db config

import MongoUser from '../models/User'; // Import MongoDB User model

export const register = async (req: Request, res: Response) => {
  try {
    console.log('[AUTH_REGISTER] Request body:', req.body);
    const { name, email, password, role, medicalLicense, department } = req.body;
    const trimmedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();
    const normalizedRole = role?.trim().toUpperCase() || 'PATIENT';

    // Check if user already exists in Neon
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Identity Node already exists' });
    }

    // REQUIREMENT: Doctor MUST provide medical license
    if (normalizedRole === 'DOCTOR' && !medicalLicense) {
      return res.status(400).json({ message: 'Medical License Number is REQUIRED for Doctor registration' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const sharedId = crypto.randomUUID();

    // 1. Save to Neon PostgreSQL
    const user = await prisma.user.create({
      data: {
        id: sharedId,
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword,
        role: normalizedRole,
        medicalLicense: normalizedRole === 'DOCTOR' ? medicalLicense : undefined,
        department: normalizedRole === 'DOCTOR' ? department : undefined,
        medicalRecord: normalizedRole === 'PATIENT' ? {
          create: {
            id: `mr_${Date.now()}`,
            fullName: trimmedName,
            allergies: [],
            conditions: []
          }
        } : undefined
      }
    });

    // 2. Save to MongoDB Atlas (Dual Write)
    try {
      const existingMongoUser = await MongoUser.findOne({ email: normalizedEmail });
      if (!existingMongoUser) {
        const mongoUser = new MongoUser({
          _id: sharedId,
          name: trimmedName,
          email: normalizedEmail,
          password: hashedPassword,
          role: normalizedRole.toLowerCase() as 'patient' | 'doctor',
          medicalLicense: normalizedRole === 'DOCTOR' ? medicalLicense : undefined,
          department: normalizedRole === 'DOCTOR' ? department : undefined,
        });
        await mongoUser.save();
        console.log(`[SUCCESS] User synced to MongoDB with shared ID: ${sharedId}`);
      }
    } catch (mongoError) {
      console.error('MongoDB Sync Warning:', mongoError);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: { id: user.id, name: trimmedName, email: normalizedEmail, role: user.role, theme: user.theme }
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
    const normalizedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    console.log(`[LOGIN_DEBUG] Attempting login for: ${normalizedEmail}`);
    // console.log('[LOGIN_DEBUG] Request body:', req.body); // Careful with logging password!

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      console.log(`[LOGIN_DEBUG] User not found in Prisma: ${normalizedEmail}`);
      return res.status(400).json({ message: 'Invalid identity credentials' });
    }

    const isMatch = await bcrypt.compare(trimmedPassword, user.password);
    console.log(`[LOGIN_DEBUG] Password match result: ${isMatch}`);

    if (!isMatch) {
      console.log(`[LOGIN_DEBUG] Password mismatch for user: ${normalizedEmail}`);
      return res.status(400).json({ message: 'Invalid identity credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, theme: user.theme }
    });
  } catch (error: any) {
    console.error('Login Error:', error);
    if (error.code === 'P1001' || error.code === 'P1017') {
      return res.status(503).json({ message: 'Database connection unavailable. Please try again.' });
    }
    res.status(500).json({ message: 'Neural access denied' });
  }
};