import express, { Application } from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import authRoutes from './routes/authRoutes';
import contactRoutes from './routes/contactRoutes';
import medicalRoutes from './routes/medicalRoutes';
import emergencyRoutes from './routes/emergencyRoutes';
import locationRoutes from './routes/locationRoutes';
import familyRoutes from './routes/familyRoutes';
import doctorRoutes from './routes/doctorRoutes';
import postRoutes from './routes/postRoutes';
import { setupSocketHandlers } from './socketHandlers';
dotenv.config();

const app: Application = express();
app.use(compression());

const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(
  process.env.MONGO_URI || 'mongodb://localhost:27017/medical_app'
)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Database connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/posts', postRoutes);

// Setup Socket.io handlers
setupSocketHandlers(io);

// Make io accessible to routes
app.set('io', io);

// Server Start
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io ready for real-time connections`);
});