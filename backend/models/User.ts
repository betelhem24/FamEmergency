import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor';
  // Doctor fields
  medicalLicense?: string;
  department?: string;
  // Patient fields
  bloodType?: string;
  allergies?: string[];
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },
  medicalLicense: { type: String },
  department: { type: String },
  bloodType: { type: String },
  allergies: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
