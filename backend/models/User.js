// I import the mongoose library to help me create the database blueprint
const mongoose = require('mongoose');

// I create the blueprint for how a User looks in MongoDB
const userSchema = new mongoose.Schema({
  // I store the name as a string and make it a required field
  name: { type: String, required: true },
  
  // I store the email, make it required, and ensure it is unique in the database
  email: { type: String, required: true, unique: true },
  
  // I store the scrambled password string
  password: { type: String, required: true },
  
  // I add a role field to distinguish between Patients and Doctors
  // I set the default to PATIENT for safety
  role: { 
    type: String, 
    enum: ['PATIENT', 'DOCTOR'], 
    default: 'PATIENT' 
  },
  
  // I add a field for medical history which can store any object of data
  // This is where the QR code information will come from
  medicalHistory: { type: Object, default: {} }
}, { 
  // I add timestamps to automatically record when a user was created
  timestamps: true 
});

// I export the model so I can use it in my server files
module.exports = mongoose.model('User', userSchema);