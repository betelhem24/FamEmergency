import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../components/UI/GlassCard';
import { Button } from '../../components/UI/Button';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '../../store';
import { setActiveEmergency } from '../../store/slices/emergencySlice';
import { useSocketEvents } from '../../hooks/useSocketEvents';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const GuardianTimerTab: React.FC = () => {
    const [duration, setDuration] = useState(5); // minutes
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const dispatch = useDispatch();
    const { emitEmergency } = useSocketEvents();
    const token = useSelector((state: RootState) => state.auth.token);
    const myLocation = useSelector((state: RootState) => state.location.myLocation);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer expired - trigger emergency
            triggerAutoEmergency();
            setIsActive(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const triggerAutoEmergency = async () => {
        if (!myLocation) return;

        try {
            const response = await axios.post(
                `${API_URL}/api/emergency/trigger`,
                {
                    type: 'GUARDIAN_TIMER',
                    severity: 'URGENT',
                    location: {
                        latitude: myLocation.latitude,
                        longitude: myLocation.longitude
                    }
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const emergency = response.data.emergency;
            dispatch(setActiveEmergency(emergency));
            emitEmergency(emergency._id);
        } catch (error) {
            console.error('Failed to trigger auto emergency:', error);
        }
    };

    const startTimer = () => {
        setTimeLeft(duration * 60);
        setIsActive(true);
    };

    const stopTimer = () => {
        setIsActive(false);
        setTimeLeft(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ padding: '1rem' }}>
            <GlassCard size="lg" className="fade-in text-center">
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Guardian Timer
                </h2>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Set a safety check-in timer. If not stopped, emergency alert will trigger automatically.
                </p>

                {!isActive ? (
                    <div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                min="1"
                                max="60"
                                className="glass-input"
                                style={{ width: '100px', textAlign: 'center' }}
                            />
                        </div>
                        <Button variant="primary" size="lg" onClick={startTimer}>
                            Start Timer
                        </Button>
                    </div>
                ) : (
                    <div>
                        <div style={{
                            fontSize: '4rem',
                            fontWeight: 'bold',
                            color: timeLeft < 60 ? 'var(--danger)' : 'var(--primary)',
                            marginBottom: '2rem',
                            animation: timeLeft < 60 ? 'pulse 1s infinite' : 'none'
                        }}>
                            {formatTime(timeLeft)}
                        </div>
                        <Button variant="success" size="lg" onClick={stopTimer}>
                            I'm Safe - Stop Timer
                        </Button>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};
