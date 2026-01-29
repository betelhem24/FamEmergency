import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    connected: false
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
    children: React.ReactNode;
    token: string | null;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
    children,
    token
}) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        const newSocket = io(
            import.meta.env.VITE_API_URL || 'http://localhost:5000',
            {
                auth: { token },
                transports: ['websocket', 'polling']
            }
        );

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {children}
        </SocketContext.Provider>
    );
};
