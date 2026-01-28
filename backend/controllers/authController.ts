import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // I use this for MongoDB operations
import prisma from '../db/prisma'; // I use this for Neon (PostgreSQL) operations

// I export the register function to handle new account creation
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. I check if the user already exists in MongoDB to avoid duplicates
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. I hash the password so it is stored as a secret code, not plain text
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. I SAVE TO MONGODB (Our flexible NoSQL database)
    const mongoUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });
    await mongoUser.save();

    // 4. I SAVE TO NEON (Our structured SQL database for redundancy)
    // I am using prisma to ensure the data is synced across both platforms
    // I must pass the id as a string because we changed schema.prisma to id String @id
    await prisma.user.create({
      data: {
        id: mongoUser._id.toString(), // I sync the MongoDB ID to SQL
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase() // I ensure role matches SQL Enum (PATIENT/DOCTOR)
      }
    });

    // 5. I generate a JWT token so the user stays logged in after registering
    const token = jwt.sign(
      { userId: mongoUser._id, role: mongoUser.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // 6. I send the success response back to the frontend
    res.status(201).json({
      token,
      user: { id: mongoUser._id, name, email, role }
    });
    
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Something went wrong during registration' });
  }
};

// I export the login function to handle existing user access
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. I look for the user in MongoDB by their email address
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2. I compare the typed password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. I create a new JWT token for this session
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // 4. I return the user info and token to the frontend
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};