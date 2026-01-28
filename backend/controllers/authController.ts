import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // This is the MongoDB Model
import prisma from '../db/prisma'; // This is the Neon/SQL Client

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. SAVE TO MONGODB
    const mongoUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });
    await mongoUser.save();

    // 4. SAVE TO NEON (SQL)
    // I use prisma to create the same user in our PostgreSQL database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    // 5. Create JWT Token
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
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// ... login function stays the same for now ...