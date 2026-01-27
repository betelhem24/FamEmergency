import { Request, Response } from 'express';
import User from '../models/User'; // I import our secure User model

// This function handles new user registration
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. I check if the user already exists in MongoDB
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. I create a new user instance
    // Note: The password will be hashed automatically by our Model!
    const user = await User.create({
      name,
      email,
      password
    });

    // 3. I send back a success message (without the password!)
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};