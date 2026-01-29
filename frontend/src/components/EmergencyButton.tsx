import { useState, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface EmergencyButtonProps {
    onEmergency: () => void;
    holdDuration?: number;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({
    onEmergency,
    holdDuration = 2000
}) => {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<NodeJS.Timeout | null>(null);

    const handleStart = () => {
        setIsHolding(true);
        setProgress(0);

        progressRef.current = setInterval(() => {
            setProgress(prev => Math.min(prev + (100 / (holdDuration / 100)), 100));
        }, 100);

        timerRef.current = setTimeout(() => {
            onEmergency();
            handleEnd();
        }, holdDuration);
    };

    const handleEnd = () => {
        setIsHolding(false);
        setProgress(0);
        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressRef.current) clearInterval(progressRef.current);
    };

    return (
        <button
            className={`emergency-btn ${isHolding ? 'holding' : ''}`}
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
        >
            <div className="emergency-progress" style={{ width: `${progress}%` }}></div>
            <AlertCircle size={24} />
            <span>EMERGENCY: Tap & Hold</span>
        </button>
    );
};

export default EmergencyButton;
