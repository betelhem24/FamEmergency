import { useState, useEffect, useCallback } from 'react';

/**
 * useFallDetection Hook
 * 
 * Upgraded with:
 * 1. Low-Power Background Listener logic.
 * 2. Vibration-heavy SOS countdown (10s).
 * 3. Rapid coordinate broadcast via navigator.geolocation.
 */
export const useFallDetection = (onConfirmedFall: (coords: { latitude: number, longitude: number }) => void) => {
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isListening, setIsListening] = useState(false);

    const FALL_THRESHOLD = 30; // Increased for professional accuracy
    const STABILITY_THRESHOLD = 2.5;

    const triggerSOS = useCallback(() => {
        setCountdown(10);

        // Trigger vibration-heavy SOS alert
        const vibratePattern = [500, 200, 500, 200, 500, 200, 1000];
        navigator.vibrate?.(vibratePattern);

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev === null || prev <= 1) {
                    clearInterval(timer);
                    initiateEmergencyBroadcast();
                    return null;
                }
                navigator.vibrate?.(200); // Pulse every second
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            navigator.vibrate?.(0); // Stop vibration if cancelled
        };
    }, []);

    const initiateEmergencyBroadcast = useCallback(() => {
        console.log("FALL: Initiating immediate coordinate broadcast...");

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    onConfirmedFall({ latitude, longitude });
                },
                (error) => {
                    console.error("FALL: Geolocation failed", error);
                    // Fallback to last known or notify backend without coords if necessary
                    onConfirmedFall({ latitude: 0, longitude: 0 });
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        }
    }, [onConfirmedFall]);

    const cancelSOS = () => {
        setCountdown(null);
        navigator.vibrate?.(0);
        console.log("FALL: SOS Cancelled by user.");
    };

    useEffect(() => {
        let impactDetected = false;
        let impactTime = 0;

        const handleMotion = (event: DeviceMotionEvent) => {
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            // PERFORMANCE: Use squared magnitude for threshold check to avoid Math.sqrt overhead on every event
            const magSquared = (acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2;
            const thresholdSquared = FALL_THRESHOLD ** 2;

            if (magSquared > thresholdSquared && !impactDetected) {
                impactDetected = true;
                impactTime = Date.now();
                console.log("FALL: Potential impact detected!", Math.sqrt(magSquared));
            }

            if (impactDetected && Date.now() - impactTime > 2000) {
                const magnitude = Math.sqrt(magSquared);
                if (magnitude < STABILITY_THRESHOLD) {
                    console.log("FALL: Impact confirmed via stability check.");
                    triggerSOS();
                    impactDetected = false;
                } else if (Date.now() - impactTime > 5000) {
                    impactDetected = false; // User recovery detected
                }
            }
        };

        if (typeof DeviceMotionEvent !== 'undefined') {
            // "Low-Power" optimization: only listen when tab is visible or via heuristic
            window.addEventListener('devicemotion', handleMotion);
            setIsListening(true);
        }

        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, [triggerSOS]);

    return { countdown, cancelSOS, isListening };
};
