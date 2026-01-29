import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalRecord extends Document {
    userId: string;
    fullName: string;
    dob: string;
    gender: 'male' | 'female' | 'other';
    age: number;
    familyPhone: string;
    bloodType: string;
    height: string;
    weight: string;
    allergies: string[];
    conditions: string[];
    medications: {
        name: string;
        dosage: string;
        frequency: string;
    }[];
    contacts: {
        id: string;
        name: string;
        phone: string;
        relationship: string;
    }[];
    createdAt: Date;
}

const medicalRecordSchema = new Schema<IMedicalRecord>({
    userId: { type: String, required: true },
    fullName: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    age: { type: Number, default: 0 },
    familyPhone: { type: String, default: '' },
    bloodType: { type: String, default: '' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    allergies: { type: [String], default: [] },
    conditions: { type: [String], default: [] },
    medications: [{
        name: String,
        dosage: String,
        frequency: String
    }],
    contacts: [{
        id: String,
        name: String,
        phone: String,
        relationship: String
    }]
}, { timestamps: true });

export default mongoose.model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);
