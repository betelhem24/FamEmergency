import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Date;
}

export interface IChat extends Document {
    participants: string[]; // User IDs from Neon
    messages: IMessage[];
    lastActive: Date;
}

const chatSchema = new Schema<IChat>({
    participants: [{ type: String, required: true }],
    messages: [{
        senderId: { type: String, required: true },
        senderName: { type: String, required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure indices for quick participant lookup
chatSchema.index({ participants: 1 });

export default mongoose.model<IChat>('Chat', chatSchema);
