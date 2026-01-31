import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    userId: string;
    userName: string;
    content: string;
    supports: string[];
    comments: {
        userId: string;
        userName: string;
        text: string;
        createdAt: Date;
    }[];
    createdAt: Date;
}

const postSchema = new Schema<IPost>({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    supports: [{ type: String, default: [] }],
    comments: [{
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model<IPost>('Post', postSchema);
