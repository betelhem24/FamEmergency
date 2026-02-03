import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

interface EmergencyContextType {
    sosTriggered: boolean;
    activeEmergencyId: string | null;
    isMinimized: boolean;
    triggerSOS: (type?: string) => Promise<void>;
    cancelSOS: () => Promise<void>;
    setMinimized: (minimized: boolean) => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, token } = useAuth();
    const { socket } = useSocket();
    const [sosTriggered, setSosTriggered] = useState(false);
    const [activeEmergencyId, setActiveEmergencyId] = useState<string | null>(null);
    const [isMinimized, setMinimized] = useState(false);

    const fetchActiveEmergency = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/emergency/active`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.emergencies.length > 0) {
                setSosTriggered(true);
                setActiveEmergencyId(data.emergencies[0]._id);
            }
        } catch (error) {
            console.error('Failed to fetch active emergency:', error);
        }
    }, [token]);

    useEffect(() => {
        if (user && user.role === 'PATIENT') {
            fetchActiveEmergency();
        } else {
            setSosTriggered(false);
            setActiveEmergencyId(null);
            setMinimized(false);
        }
    }, [user, fetchActiveEmergency]);

    const triggerSOS = async (type: string = 'SOS') => {
        if (!token) return;

        // Optimistic UI
        setSosTriggered(true);
        setMinimized(false); // Reset minimize when new SOS triggered

        navigator.geolocation.getCurrentPosition(async (position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: 'Real-time GPS Location'
            };

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/emergency/trigger`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ type, severity: 'CRITICAL', location })
                });

                const data = await response.json();
                if (data.success) {
                    setActiveEmergencyId(data.emergency._id);
                    if (socket) {
                        socket.emit('emergency:trigger', {
                            emergencyId: data.emergency._id,
                            location
                        });
                    }
                } else {
                    setSosTriggered(false);
                }
            } catch (error) {
                console.error('SOS Trigger Error:', error);
                setSosTriggered(false);
            }
        }, (error) => {
            console.error('Geolocation Error:', error);
            // Fallback: trigger even without GPS if needed
        });
    };

    const cancelSOS = async () => {
        if (!token) return;

        try {
            // Attempt to cancel using activeEmergencyId if we have it
            if (activeEmergencyId) {
                await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/emergency/${activeEmergencyId}/cancel`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (socket) {
                    socket.emit('emergency:cancel', { emergencyId: activeEmergencyId });
                }
            }

            // Always reset state locally to ensure UI is not blocked
            setSosTriggered(false);
            setActiveEmergencyId(null);
            setMinimized(false);

            // Re-fetch to confirm no other active emergencies remain (backend safety)
            setTimeout(fetchActiveEmergency, 1000);

        } catch (error) {
            console.error('SOS Cancel Error:', error);
            // Even on error, clear local state if user is desperate to stop
            setSosTriggered(false);
            setActiveEmergencyId(null);
        }
    };

    return (
        <EmergencyContext.Provider value={{ sosTriggered, activeEmergencyId, isMinimized, triggerSOS, cancelSOS, setMinimized }}>
            {children}
        </EmergencyContext.Provider>
    );
};

export const useEmergency = () => {
    const context = useContext(EmergencyContext);
    if (context === undefined) {
        throw new Error('useEmergency must be used within an EmergencyProvider');
    }
    return context;
};
