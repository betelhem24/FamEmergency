import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const addContact = async (req: Request, res: Response) => {
  try {
    const { name, phone, relationship } = req.body; // 'relationship' from frontend
    const userId = (req as any).user.userId;

    const newContact = await prisma.emergencyContact.create({
      data: {
        name,
        phone,
        relation: relationship, // I map 'relationship' to the schema's 'relation'
        userId: userId 
      }
    });

    res.status(201).json(newContact);
  } catch (error) {
    console.error('Add Contact Error:', error);
    res.status(500).json({ message: 'Failed to add emergency contact' });
  }
};