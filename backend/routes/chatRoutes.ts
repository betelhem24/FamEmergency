import express from 'express';
import { getChatHistory, markAsRead, getUnreadCount, sendMessage } from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Get chat history between two users
router.get('/history', getChatHistory);

// Send a message (HTTP fallback for reliable persistence)
router.post('/send', authMiddleware, sendMessage);

// Mark messages as read
router.post('/read', authMiddleware, markAsRead);

// Get unread message count
router.get('/unread', authMiddleware, getUnreadCount);

export default router;
