import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db'; // Using the central db config

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase();

    // REQUIREMENT: Check live database
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

    const user = await (prisma.user as any).create({
      data: {
        id: `user_${Date.now()}_${userCount}`,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: newUserRole,
        // Automatically create an empty MedicalRecord for PATIENTS
        medicalRecord: newUserRole === 'PATIENT' ? {
          create: {
            fullName: name,
            allergies: [],
            conditions: []
          }
        } : undefined
      }
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: { id: user.id, name, email: normalizedEmail, role: user.role }
    });

  } catch (error) {
    console.error('Registration Error:', error);
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
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Neural access denied' });
  }
};