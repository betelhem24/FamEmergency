import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// I use 'export' so the Routes can see this function
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  // ... your JWT logic here ...
};