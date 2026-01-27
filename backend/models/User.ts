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
userSchema.pre<IUser>('save', async function () {
  // If the password is not changed, I stop here
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No need to call next() here!
  } catch (error: any) {
    throw error; // I throw the error so Mongoose knows it failed
  }
});

export default mongoose.model<IUser>('User', userSchema);