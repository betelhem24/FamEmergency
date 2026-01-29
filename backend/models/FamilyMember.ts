import mongoose, { Schema, Document } from 'mongoose';

export interface IFamilyMember extends Document {
    userId: mongoose.Types.ObjectId;
    familyMemberId: mongoose.Types.ObjectId;
    relationship: string;
    status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
    permissions: {
        canViewLocation: boolean;
        canReceiveEmergency: boolean;
        canViewMedical: boolean;
    };
    addedAt: Date;
}

const FamilyMemberSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    familyMemberId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    relationship: { type: String, default: 'Family' },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'BLOCKED'],
        default: 'ACCEPTED'
    },
    permissions: {
        canViewLocation: { type: Boolean, default: true },
        canReceiveEmergency: { type: Boolean, default: true },
        canViewMedical: { type: Boolean, default: false }
    },
    addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index for efficient family queries
FamilyMemberSchema.index({ userId: 1, familyMemberId: 1 }, { unique: true });

export default mongoose.model<IFamilyMember>(
    'FamilyMember',
    FamilyMemberSchema
);
