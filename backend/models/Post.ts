import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    userId: Schema.Types.ObjectId;
    userName: string;
    content: string;
    supports: Schema.Types.ObjectId[];
    comments: {
        userId: Schema.Types.ObjectId;
        userName: string;
        text: string;
        createdAt: Date;
    }[];
    createdAt: Date;
}

const postSchema = new Schema<IPost>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    supports: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        userName: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model<IPost>('Post', postSchema);
