import mongoose, { Document, Schema } from 'mongoose';
import { encrypt, decrypt } from '../utils/encryption';

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

// Encryption Hook
medicalRecordSchema.pre('save', function (next) {
    if (this.isModified('allergies')) {
        this.allergies = this.allergies.map(a => encrypt(a));
    }
    if (this.isModified('conditions')) {
        this.conditions = this.conditions.map(c => encrypt(c));
    }
    if (this.isModified('medications')) {
        this.medications = this.medications.map(m => ({
            ...m,
            name: encrypt(m.name)
        }));
    }
    next();
});

// Decryption Hook (Triggered on retrieval)
medicalRecordSchema.post('init', function (doc) {
    if (doc.allergies) {
        doc.allergies = doc.allergies.map(a => {
            try { return decrypt(a); } catch (e) { return a; }
        });
    }
    if (doc.conditions) {
        doc.conditions = doc.conditions.map(c => {
            try { return decrypt(c); } catch (e) { return c; }
        });
    }
    if (doc.medications) {
        doc.medications = doc.medications.map((m: any) => {
            try { return { ...m, name: decrypt(m.name) }; } catch (e) { return m; }
        });
    }
});

export default mongoose.model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);
