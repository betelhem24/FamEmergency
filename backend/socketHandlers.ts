import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Location from './models/Location';
import Emergency from './models/Emergency';
import Chat from './models/Chat';
import User from './models/User';

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

        // Broadcast user online status
        socket.broadcast.emit('user:online', { userId: socket.userId });

        // Handle location updates
        socket.on('location:update', async (data) => {
            try {
                const { latitude, longitude, accuracy, heartRate, batteryLevel } = data;

                const location = new Location({
                    userId: socket.userId,
                    latitude,
                    longitude,
                    accuracy: accuracy || 0,
                    heartRate,
                    batteryLevel
                });

                await location.save();

                // Broadcast to family members and doctors
                socket.broadcast.emit('location:updated', {
                    userId: socket.userId,
                    latitude,
                    longitude,
                    heartRate: heartRate || 72,
                    batteryLevel: batteryLevel || 85,
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

                    // Also notify specifically assigned responders
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

        // Persistent Private Chat with Status Updates
        socket.on('chat:private', async (data) => {
            const { to, message, userName, image } = data;

            try {
                // Persistent save to MongoDB
                let chat = await Chat.findOne({
                    participants: { $all: [socket.userId, to] }
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [socket.userId, to],
                        messages: [],
                        unreadCount: { [socket.userId as string]: 0, [to]: 0 }
                    });
                }

                const msgToPersist = {
                    senderId: socket.userId as string,
                    senderName: userName || 'User',
                    text: message,
                    timestamp: new Date(),
                    status: 'sent' as const,
                    image
                };

                chat.messages.push(msgToPersist as any);
                chat.lastActive = new Date();

                // Increment unread count for recipient
                if (!chat.unreadCount) chat.unreadCount = {};
                (chat.unreadCount as any)[to] = ((chat.unreadCount as any)[to] || 0) + 1;

                await chat.save();

                // Emit to the recipient with delivery confirmation
                io.to(`user:${to}`).emit('chat:message', {
                    from: socket.userId,
                    userName: userName,
                    message: message,
                    image,
                    timestamp: msgToPersist.timestamp,
                    status: 'delivered'
                });

                // Send delivery confirmation back to sender
                socket.emit('chat:delivered', {
                    to,
                    timestamp: msgToPersist.timestamp
                });

                console.log(`[CHAT] Persistent message from ${socket.userId} to ${to}`);
            } catch (error) {
                console.error('[CHAT] Persistence error:', error);

                // Fallback: still emit even if saving fails
                io.to(`user:${to}`).emit('chat:message', {
                    from: socket.userId,
                    userName: userName,
                    message: message,
                    image,
                    timestamp: new Date()
                });
            }
        });

        // Typing indicator
        socket.on('chat:typing', (data) => {
            const { to, isTyping } = data;
            io.to(`user:${to}`).emit('chat:typing', {
                from: socket.userId,
                isTyping
            });
        });

        // Read receipt
        socket.on('chat:markRead', async (data) => {
            const { from } = data;

            try {
                const chat = await Chat.findOne({
                    participants: { $all: [socket.userId, from] }
                });

                if (chat) {
                    // Mark messages as read
                    let updated = false;
                    chat.messages.forEach((msg: any) => {
                        if (msg.senderId === from && msg.status !== 'read') {
                            msg.status = 'read';
                            msg.readAt = new Date();
                            updated = true;
                        }
                    });

                    // Reset unread count
                    if (chat.unreadCount) {
                        (chat.unreadCount as any)[socket.userId as string] = 0;
                    }

                    if (updated) {
                        await chat.save();

                        // Notify sender
                        io.to(`user:${from}`).emit('chat:read', {
                            from: socket.userId,
                            timestamp: new Date()
                        });
                    }
                }
            } catch (error) {
                console.error('[CHAT] Mark read error:', error);
            }
        });

        // Health Status Sync
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
        });

        socket.on('disconnect', () => {
            console.log(`[SOCKET] User disconnected: ${socket.userId}`);
            // Broadcast user offline status
            socket.broadcast.emit('user:offline', { userId: socket.userId });
        });
    });
};
