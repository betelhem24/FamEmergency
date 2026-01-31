import { Request, Response } from 'express';
import Post from '../models/Post';

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const { userId, userName, content } = req.body;
        const newPost = new Post({ userId, userName, content });
        await newPost.save();

        // Emit real-time update if io is available
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
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const index = (post.supports as any).indexOf(userId);
        if (index === -1) {
            post.supports.push(userId as any);
        } else {
            post.supports.splice(index, 1);
        }

        await post.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('post:updated', post);
        }

        res.json(post);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, userName, text } = req.body;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({ userId, userName, text, createdAt: new Date() });
        await post.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('post:updated', post);
        }

        res.json(post);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
