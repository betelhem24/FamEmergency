import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as { userId: string; role: string };

    (req as any).user = { id: decodedToken.userId, role: decodedToken.role };
    next();
  } catch (err) {
    console.error('Auth Error:', err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};