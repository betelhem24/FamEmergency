import { Request, Response } from 'express';

// Mock contacts for now
export const getContacts = async (req: Request, res: Response) => {
    try {
        const contacts = [
            { id: '1', name: 'Emergency Services', phone: '911' },
            { id: '2', name: 'Poison Control', phone: '1-800-222-1222' }
        ];
        res.json({ success: true, contacts });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
