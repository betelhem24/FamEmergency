import { Request, Response } from 'express';
import prisma from '../config/db';

export const getPosts = async (req: Request, res: Response) => {
    try {
        // REQUIREMENT: Connect to live database (Neon)
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                supports: true,
                comments: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        res.json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const { userId, userName, content } = req.body;

        // REQUIREMENT: Persistence in Posts table in Neon
        const newPost = await prisma.post.create({
            data: {
                userId,
                userName,
                content
            },
            include: {
                supports: true,
                comments: true
            }
        });

        // Emit real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('post:new', newPost);
        }

        res.status(201).json(newPost);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const supportPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // post id
        const { userId } = req.body;

        // Check if already supported
        const existingSupport = await prisma.support.findUnique({
            where: {
                postId_userId: {
                    postId: id,
                    userId: userId
                }
            }
        });

        if (existingSupport) {
            await prisma.support.delete({
                where: { id: existingSupport.id }
            });
        } else {
            await prisma.support.create({
                data: {
                    postId: id,
                    userId: userId
                }
            });
        }

        const updatedPost = await prisma.post.findUnique({
            where: { id },
            include: {
                supports: true,
                comments: true
            }
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('post:updated', updatedPost);
        }

        res.json(updatedPost);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // post id
        const { userId, userName, text } = req.body;

        const comment = await prisma.comment.create({
            data: {
                postId: id,
                userId,
                userName,
                text
            }
        });

        const updatedPost = await prisma.post.findUnique({
            where: { id },
            include: {
                supports: true,
                comments: true
            }
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('post:updated', updatedPost);
        }

        res.json(updatedPost);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
