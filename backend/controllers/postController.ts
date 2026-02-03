import { Request, Response } from 'express';
import Post from '../models/Post';

export const getPosts = async (req: Request, res: Response) => {
    try {
        // REQUIREMENT: Social Feed strictly handled by MongoDB
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const { userId, userName, content } = req.body;

        // REQUIREMENT: High-Performance Persistence in MongoDB
        const newPost = new Post({
            userId,
            userName,
            content
        });
        await newPost.save();

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

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post Alert Not Found' });

        const index = post.supports.indexOf(userId);
        if (index === -1) {
            post.supports.push(userId);
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
        const { id } = req.params; // post id
        const { userId, userName, text } = req.body;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post Alert Not Found' });

        post.comments.push({
            userId,
            userName,
            text,
            createdAt: new Date()
        });

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
export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id || req.body.userId;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post Not Found' });

        if (post.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(id);

        const io = req.app.get('io');
        if (io) {
            io.emit('post:deleted', id);
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { id, commentId } = req.params;
        const userId = (req as any).user?.id || req.body.userId;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post Not Found' });

        const commentIdx = post.comments.findIndex((c: any) => c._id?.toString() === commentId);
        if (commentIdx === -1) return res.status(404).json({ message: 'Comment Not Found' });

        const comment = post.comments[commentIdx];

        // Auth: Comment owner OR Post owner can delete
        if (comment.userId !== userId && post.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        post.comments.splice(commentIdx, 1);
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
