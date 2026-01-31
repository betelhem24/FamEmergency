import { Request, Response } from 'express';
import Chat from '../models/Chat';

export const getChatHistory = async (req: Request, res: Response) => {
    try {
        const { participant1, participant2 } = req.query;

        // Find chat involving both participants
        const chat = await Chat.findOne({
            participants: { $all: [participant1, participant2] }
        });

        res.json(chat ? chat.messages : []);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { senderId, senderName, recipientId, text } = req.body;

        let chat = await Chat.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        if (!chat) {
            chat = new Chat({
                participants: [senderId, recipientId],
                messages: []
            });
        }

        const newMessage = {
            senderId,
            senderName,
            text,
            timestamp: new Date()
        };

        chat.messages.push(newMessage);
        chat.lastActive = new Date();
        await chat.save();

        // Emit via socket for real-time
        const io = req.app.get('io');
        if (io) {
            io.to(`user_${recipientId}`).emit('chat:message', newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
