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
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || ''
            ) as any;
            socket.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket: AuthSocket) => {
        console.log(`User connected: ${socket.userId}`);

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
                const emergency = await Emergency.findById(data.emergencyId)
                    .populate('responders.userId', 'name email');

                if (emergency) {
                    // Notify all responders
                    emergency.responders.forEach((responder: any) => {
                        io.to(`user:${responder.userId._id}`).emit(
                            'emergency:alert',
                            {
                                emergencyId: emergency._id,
                                userId: socket.userId,
                                type: emergency.type,
                                severity: emergency.severity,
                                location: emergency.location,
                                triggeredAt: emergency.triggeredAt
                            }
                        );
                    });
                }
            } catch (error) {
                console.error('Emergency trigger error:', error);
            }
        });

        // Handle emergency cancellation
        socket.on('emergency:cancel', (data) => {
            socket.broadcast.emit('emergency:cancelled', {
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

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });
};
