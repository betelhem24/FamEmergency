import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSocket } from '../context/SocketContext';
import { setMyLocation, updateFamilyLocation } from '../store/slices/locationSlice';
import { setActiveEmergency, clearActiveEmergency } from '../store/slices/emergencySlice';

export const useSocketEvents = () => {
    const { socket } = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket) return;

        // Listen for location updates from family members
        socket.on('location:updated', (data) => {
            dispatch(updateFamilyLocation({
                userId: data.userId,
                name: data.name || 'Family Member',
                location: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    accuracy: data.accuracy || 0,
                    timestamp: data.timestamp
                }
            }));
        });

        // Listen for emergency alerts
        socket.on('emergency:alert', (data) => {
            dispatch(setActiveEmergency(data));

            // Show browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Emergency Alert!', {
                    body: `${data.type} emergency triggered`,
                    icon: '/emergency-icon.png',
                    tag: data.emergencyId
                });
            }
        });

        // Listen for emergency cancellations
        socket.on('emergency:cancelled', (_data) => {
            dispatch(clearActiveEmergency());
        });

        return () => {
            socket.off('location:updated');
            socket.off('emergency:alert');
            socket.off('emergency:cancelled');
        };
    }, [socket, dispatch]);

    const emitLocation = useCallback((latitude: number, longitude: number, accuracy: number) => {
        if (socket) {
            socket.emit('location:update', { latitude, longitude, accuracy });
            dispatch(setMyLocation({ latitude, longitude, accuracy, timestamp: new Date().toISOString() }));
        }
    }, [socket, dispatch]);

    const emitEmergency = useCallback((emergencyId: string) => {
        if (socket) {
            socket.emit('emergency:trigger', { emergencyId });
        }
    }, [socket]);

    const emitCancelEmergency = useCallback((emergencyId: string) => {
        if (socket) {
            socket.emit('emergency:cancel', { emergencyId });
        }
    }, [socket]);

    return { emitLocation, emitEmergency, emitCancelEmergency };
};
