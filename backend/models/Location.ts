import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
    userId: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: Date;
    isTracking: boolean;
    heartRate?: number;
    batteryLevel?: number;
}

const LocationSchema: Schema = new Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
        index: true
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    isTracking: { type: Boolean, default: true },
    heartRate: { type: Number },
    batteryLevel: { type: Number }
}, { timestamps: true });

// Index for efficient location queries
LocationSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model<ILocation>('Location', LocationSchema);
