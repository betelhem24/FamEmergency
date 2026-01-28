import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'patient' }
}, { timestamps: true });

// I removed 'next' because 'async' functions handle the flow automatically
// I removed the pre-save hook because hashing is handled in the controller.
// This prevents double-hashing which was causing login failures.

export default mongoose.model<IUser>('User', userSchema);
