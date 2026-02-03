import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor';
  // Doctor fields
  medicalLicense?: string;
  department?: string;
  theme?: string;
  phoneNumber?: string;
}

const userSchema = new Schema<IUser>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor'], default: 'patient' },
  medicalLicense: { type: String },
  department: { type: String },
  theme: { type: String, default: 'dark' },
  phoneNumber: { type: String, default: '' }
}, { timestamps: true, _id: false });

export default mongoose.model<IUser>('User', userSchema);
