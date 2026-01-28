import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; 
import prisma from '../db/prisma';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // I convert email to lowercase to prevent "Maya" vs "maya" issues
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // I save to MongoDB first to get the generated _id
    const mongoUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role
    });
    await mongoUser.save();

    // I sync to Neon SQL using the same String ID
    await prisma.user.create({
      data: {
        id: mongoUser._id.toString(),
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: role.toUpperCase() as any,
        createdAt: new Date() // I manually set this to fix the 500 error
      }
    });

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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    // I look for the user in MongoDB
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // I verify the password
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