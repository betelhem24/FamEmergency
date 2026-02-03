import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Location from './models/Location';
import Emergency from './models/Emergency';

interface AuthSocket extends Socket {
    userId?: string;
}

export const setupSocketHandlers = (io: SocketServer) => {
    // Authentication middleware for socket connections
    io.use((socket: AuthSocket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            console.log('[SOCKET] Connection rejected: No authentication token provided');
            return next(new Error('Authentication required: No token provided'));
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || ''
            ) as any;
            socket.userId = decoded.userId;
            next();
        } catch (err) {
            console.log('[SOCKET] Connection rejected: Invalid token');
            return next(new Error('Authentication failed: Invalid token'));
        }
    });

    io.on('connection', (socket: AuthSocket) => {
        console.log(`[SOCKET] User connected: ${socket.userId} (ID: ${socket.id})`);

        // Join user's personal room
        socket.join(`user:${socket.userId}`);

        // Handle location updates
        socket.on('location:update', async (data) => {
            try {
                const { latitude, longitude, accuracy } = data;

                const location = new Location({
                    userId: socket.userId,
                    latitude,
                    longitude,
                    accuracy: accuracy || 0
                });

                await location.save();

                // Broadcast to family members
                socket.broadcast.emit('location:updated', {
                    userId: socket.userId,
                    latitude,
                    longitude,
                    timestamp: new Date()
                });
            } catch (error) {
                console.error('Location update error:', error);
            }
        });

        // Handle emergency alerts
        socket.on('emergency:trigger', async (data) => {
            try {
                // If data includes emergency details, we might want to create it here or just fetch it
                // For now, assuming client creates it and sends ID
                const emergency = await Emergency.findById(data.emergencyId)
                    .populate('userId', 'name email');

                if (emergency) {
                    console.log(`[EMERGENCY] Triggered by ${emergency.userId}: ${emergency.type}`);

                    // Notify ALL doctors (global room)
                    io.to('room:doctors').emit('emergency:alert', {
                        emergencyId: emergency._id,
                        userId: socket.userId,
                        userName: (emergency.userId as any).name,
                        type: emergency.type,
                        severity: emergency.severity,
                        location: emergency.location,
                        triggeredAt: emergency.triggeredAt
                    });

                    // Also notify specifically assigned responders if any
                    if (emergency.responders && emergency.responders.length > 0) {
                        emergency.responders.forEach((responder: any) => {
                            io.to(`user:${responder.userId}`).emit('emergency:alert', {
                                emergencyId: emergency._id,
                                userId: socket.userId,
                                type: emergency.type,
                                severity: emergency.severity,
                                location: emergency.location,
                                triggeredAt: emergency.triggeredAt
                            });
                        });
                    }
                }
            } catch (error) {
                console.error('Emergency trigger error:', error);
            }
        });

        // Handle emergency cancellation
        socket.on('emergency:cancel', (data) => {
            console.log(`[EMERGENCY] Cancelled by user: ${socket.userId}`);
            socket.broadcast.emit('emergency:cancelled', {
                emergencyId: data.emergencyId,
                userId: socket.userId
            });
            io.to('room:doctors').emit('emergency:cancelled', {
                emergencyId: data.emergencyId,
                userId: socket.userId
            });
        });

        // V3 Community Chat Handlers
        socket.on('join-room', (room) => {
            socket.join(room);
            console.log(`User ${socket.userId} joined room: ${room}`);
        });

        socket.on('send-message', (data) => {
            // Broadcast to everyone in the room except the sender
            socket.to(data.room).emit('new-message', data);
        });

        // Private Doctor-Patient Chat
        socket.on('chat:send', (data) => {
            const { to, message } = data;
            // Emit to the recipient
            io.to(`user:${to}`).emit('chat:message', message);
            // In a real app, we would save the message to MongoDB here
            console.log(`[CHAT] Message from ${socket.userId} to ${to}: ${message.text || 'Image'}`);
        });

        socket.on('chat:private', (data) => {
            const { to, message, userName } = data;
            io.to(`user:${to}`).emit('chat:message', {
                from: socket.userId,
                userName,
                message,
                timestamp: new Date()
            });
        });

        // Health Status Sync (from Patient to Doctors)
        socket.on('health:update', (data) => {
            socket.to('room:doctors').emit('health:status', {
                ...data,
                userId: socket.userId,
                timestamp: new Date()
            });
        });

        socket.on('doctor:join', () => {
            socket.join('room:doctors');
            console.log(`Doctor ${socket.userId} joined monitoring room`);
            // Notify patients that a doctor is online (optional feature enhancement)
            socket.broadcast.emit('doctor:status', {
                userId: socket.userId,
                status: 'online'
            });
        });

        socket.on('disconnect', () => {
            console.log(`[SOCKET] User disconnected: ${socket.userId} (ID: ${socket.id})`);
        });
    });
};
