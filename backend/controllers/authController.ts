import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; 
import prisma from '../db/prisma';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. I check if the user already exists in MongoDB
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. I hash the password with a consistent salt round
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. I SAVE TO MONGODB
    const mongoUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    });
    await mongoUser.save();

    // 4. I SAVE TO NEON (SQL) - Ensuring ID is a String
    await prisma.user.create({
      data: {
        id: mongoUser._id.toString(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role.toUpperCase() as any,
        createdAt: new Date() // I manually set this to avoid schema mismatch
      }
    });

    const token = jwt.sign(
      { userId: mongoUser._id, role: mongoUser.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: { id: mongoUser._id, name, email, role }
    });
    
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Something went wrong during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. I look for the user using a case-insensitive email search
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. I compare the password directly with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};