import { useEffect, useState } from 'react';

export const useSensors = (onFallDetected: () => void) => {
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const FALL_THRESHOLD = 25; // G-force threshold for impact
        const STABILITY_THRESHOLD = 2; // Threshold for "no movement" after impact

        let impactDetected = false;
        let impactTime = 0;

        const handleMotion = (event: DeviceMotionEvent) => {
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            const currentAcc = {
                x: acc.x || 0,
                y: acc.y || 0,
                z: acc.z || 0
            };

            // Calculate total magnitude
            const magnitude = Math.sqrt(
                currentAcc.x ** 2 +
                currentAcc.y ** 2 +
                currentAcc.z ** 2
            );

            // Fall Detection Logic:
            // 1. Detect high G-force impact
            if (magnitude > FALL_THRESHOLD && !impactDetected) {
                impactDetected = true;
                impactTime = Date.now();
                console.log('SENSORS: Potential impact detected!', magnitude);
            }

            // 2. After impact, check for lack of movement (stability)
            if (impactDetected && (Date.now() - impactTime > 2000)) {
                if (magnitude < STABILITY_THRESHOLD) {
                    console.log('SENSORS: FALL CONFIRMED - Triggering SOS');
                    onFallDetected();
                    impactDetected = false; // Reset
                } else if (Date.now() - impactTime > 5000) {
                    // Reset if movement continues after 5 seconds
                    impactDetected = false;
                    console.log('SENSORS: User moving, false alarm reset.');
                }
            }
        };

        if (typeof DeviceMotionEvent !== 'undefined') {
            window.addEventListener('devicemotion', handleMotion);
            setIsListening(true);
        } else {
            console.warn('SENSORS: DeviceMotionEvent not supported on this device/browser.');
        }

        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, [onFallDetected]);

    return { isListening };
};
