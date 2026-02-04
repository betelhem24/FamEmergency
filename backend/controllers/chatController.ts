import { Request, Response } from 'express';
import Chat from '../models/Chat';

export const getChatHistory = async (req: Request, res: Response) => {
    try {
        const { participant1, participant2 } = req.query;

        console.log(`[CHAT] Fetching history: ${participant1} and ${participant2}`);

        if (!participant1 || !participant2) {
            return res.status(400).json({ message: "Participant IDs are required" });
        }

        // Find chat involving both participants
        const chat = await Chat.findOne({
            participants: { $all: [participant1, participant2] }
        });

        res.json(chat ? chat.messages : []);
    } catch (error: any) {
        console.error('[CHAT] Error fetching history:', error);
        res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { senderId, senderName, recipientId, text, image } = req.body;

        let chat = await Chat.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        if (!chat) {
            chat = new Chat({
                participants: [senderId, recipientId],
                messages: [],
                unreadCount: { [senderId]: 0, [recipientId]: 0 }
            });
        }

        const newMessage = {
            senderId,
            senderName,
            text,
            timestamp: new Date(),
            status: 'sent' as const,
            image
        };

        chat.messages.push(newMessage as any);
        chat.lastActive = new Date();

        // Increment unread count for recipient
        if (!chat.unreadCount) chat.unreadCount = {};
        (chat.unreadCount as any)[recipientId] = ((chat.unreadCount as any)[recipientId] || 0) + 1;

        await chat.save();

        // Emit via socket for real-time
        const io = req.app.get('io');
        if (io) {
            io.to(`user:${recipientId}`).emit('chat:message', newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { userId, otherUserId } = req.body;

        const chat = await Chat.findOne({
            participants: { $all: [userId, otherUserId] }
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Mark all messages from otherUserId as read
        let updated = false;
        chat.messages.forEach((msg: any) => {
            if (msg.senderId === otherUserId && msg.status !== 'read') {
                msg.status = 'read';
                msg.readAt = new Date();
                updated = true;
            }
        });

        // Reset unread count for this user
        if (chat.unreadCount) {
            (chat.unreadCount as any)[userId] = 0;
        }

        if (updated) {
            await chat.save();

            // Emit read receipt to sender
            const io = req.app.get('io');
            if (io) {
                io.to(`user:${otherUserId}`).emit('chat:read', { userId, timestamp: new Date() });
            }
        }

        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUnreadCount = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const chats = await Chat.find({
            participants: userId
        });

        let totalUnread = 0;
        chats.forEach(chat => {
            if (chat.unreadCount) {
                totalUnread += (chat.unreadCount as any)[userId] || 0;
            }
        });

        res.json({ unreadCount: totalUnread });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
