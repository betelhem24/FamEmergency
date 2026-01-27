import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import contactRoutes from './routes/contactRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
// I use cors to let the frontend access the backend
app.use(cors());
// I use express.json so the server can read the data sent in requests
app.use(express.json());

// 2. Database Connection
// I connect to the MONGO_URI from the .env file
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medical_app')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Database connection error:', err));

// 3. Routes
// I link the authentication routes (Register/Login)
app.use('/api/auth', authRoutes);
// I link the emergency contact routes
app.use('/api/contacts', contactRoutes);

// 4. Server Start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});