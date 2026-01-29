import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setMyLocation, setTracking } from '../store/slices/locationSlice';
import { useSocketEvents } from './useSocketEvents';

export const useGeolocation = () => {
    const [error, setError] = useState<string | null>(null);
    const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const dispatch = useDispatch();
    const { emitLocation } = useSocketEvents();

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
                setPermission(result.state as any);
            });
        }
    }, []);

    const getCurrentLocation = useCallback(() => {
        return new Promise<GeolocationPosition>((resolve, reject) => {
            if (!('geolocation' in navigator)) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        });
    }, []);

    const startTracking = useCallback(() => {
        if (!('geolocation' in navigator)) {
            setError('Geolocation not supported');
            return null;
        }

        dispatch(setTracking(true));

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                dispatch(setMyLocation({
                    latitude,
                    longitude,
                    accuracy,
                    timestamp: new Date().toISOString()
                }));

                emitLocation(latitude, longitude, accuracy);
                setError(null);
            },
            (err) => {
                setError(err.message);
                dispatch(setTracking(false));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000
            }
        );

        return watchId;
    }, [dispatch, emitLocation]);

    const stopTracking = useCallback((watchId: number | null) => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            dispatch(setTracking(false));
        }
    }, [dispatch]);

    return {
        getCurrentLocation,
        startTracking,
        stopTracking,
        error,
        permission
    };
};
