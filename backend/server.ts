import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// I import the authentication routes for Login/Register
import authRoutes from './routes/authRoutes';
// I import the contact routes to handle SQL family data
import contactRoutes from './routes/contactRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
// I use cors to allow the frontend to communicate with this server
app.use(cors());
// I use express.json so the server can parse incoming JSON data
app.use(express.json());

// 2. Database Connection
// I connect to MongoDB to handle the primary user accounts
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medical_app')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Database connection error:', err));

// 3. Routes
// All auth requests go to /api/auth
app.use('/api/auth', authRoutes);
// All emergency contact requests go to /api/contacts
app.use('/api/contacts', contactRoutes);

// 4. Server Start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});