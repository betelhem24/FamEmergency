import dotenv from 'dotenv';
dotenv.config();
import path from 'path';

import express, { Application } from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import compression from 'compression';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import contactRoutes from './routes/contactRoutes';
import medicalRoutes from './routes/medicalRoutes';
import emergencyRoutes from './routes/emergencyRoutes';
import locationRoutes from './routes/locationRoutes';
import familyRoutes from './routes/familyRoutes';
import doctorRoutes from './routes/doctorRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import { setupSocketHandlers } from './socketHandlers';
import connectMongoDB from './config/mongo';

const app: Application = express();

// REQUIREMENT: High-Performance Optimization - early compression
app.use(compression());

const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176'
    ],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ],
  credentials: true
}));
app.use(express.json());

// Database Connection - REQUIREMENT: Live Dual-Database Hybrid (Neon + Atlas)
connectDB();
connectMongoDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Setup Socket.io handlers
setupSocketHandlers(io);

// Make io accessible to routes
app.set('io', io);

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server Start
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.io ready for real-time connections`);
});