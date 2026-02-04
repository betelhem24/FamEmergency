import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
    readAt?: Date;
    image?: string;
}

export interface IChat extends Document {
    participants: string[]; // User IDs from Neon
    messages: IMessage[];
    lastActive: Date;
    typingUsers: string[]; // User IDs currently typing
    unreadCount: Record<string, number>; // Unread count per user
}

const chatSchema = new Schema<IChat>({
    participants: [{ type: String, required: true }],
    messages: [{
        senderId: { type: String, required: true },
        senderName: { type: String, required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
        readAt: { type: Date },
        image: { type: String }
    }],
    lastActive: { type: Date, default: Date.now },
    typingUsers: [{ type: String }],
    unreadCount: { type: Map, of: Number, default: {} }
}, { timestamps: true });

// Ensure indices for quick participant lookup
chatSchema.index({ participants: 1 });
chatSchema.index({ lastActive: -1 });

export default mongoose.model<IChat>('Chat', chatSchema);
