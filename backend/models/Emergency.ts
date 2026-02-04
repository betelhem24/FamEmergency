import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergency extends Document {
    userId: string;
    type: 'SOS' | 'GUARDIAN_TIMER' | 'FALL_DETECTED' | 'MANUAL';
    severity: 'CRITICAL' | 'URGENT' | 'WARNING';
    location: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    status: 'ACTIVE' | 'CANCELLED' | 'RESOLVED';
    responders: Array<{
        userId: string;
        status: 'NOTIFIED' | 'SEEN' | 'RESPONDING' | 'DECLINED';
        timestamp: Date;
    }>;
    triggeredAt: Date;
    resolvedAt?: Date;
    notes?: string;
    familyContacts?: Array<{
        name: string;
        phone: string;
        relationship: string;
    }>;
}

const EmergencySchema: Schema = new Schema({
    userId: { type: String, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['SOS', 'GUARDIAN_TIMER', 'FALL_DETECTED', 'MANUAL'],
        required: true
    },
    severity: {
        type: String,
        enum: ['CRITICAL', 'URGENT', 'WARNING'],
        default: 'CRITICAL'
    },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: String
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'CANCELLED', 'RESOLVED'],
        default: 'ACTIVE'
    },
    responders: [{
        userId: { type: String, ref: 'User' },
        status: {
            type: String,
            enum: ['NOTIFIED', 'SEEN', 'RESPONDING', 'DECLINED']
        },
        timestamp: { type: Date, default: Date.now }
    }],
    triggeredAt: { type: Date, default: Date.now },
    resolvedAt: Date,
    notes: String,
    familyContacts: [{
        name: String,
        phone: String,
        relationship: String
    }]
}, { timestamps: true });

export default mongoose.model<IEmergency>('Emergency', EmergencySchema);
