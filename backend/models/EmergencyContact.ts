import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript to understand the Emergency Contact structure
export interface IEmergencyContact extends Document {
  userId: mongoose.Types.ObjectId;
  contactName: string;
  phoneNumber: string;
  relationship: string;
  isPrimary: boolean;
}

// Schema defining how emergency contacts are stored in the database
const EmergencyContactSchema: Schema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  contactName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  relationship: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }
});

export default mongoose.model<IEmergencyContact>('EmergencyContact', EmergencyContactSchema);