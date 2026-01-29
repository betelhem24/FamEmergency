import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Emergency {
    _id: string;
    userId: string;
    type: 'SOS' | 'GUARDIAN_TIMER' | 'FALL_DETECTED' | 'MANUAL';
    severity: 'CRITICAL' | 'URGENT' | 'WARNING';
    location: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    status: 'ACTIVE' | 'CANCELLED' | 'RESOLVED';
    triggeredAt: string;
}

export interface EmergencyState {
    activeEmergency: Emergency | null;
    emergencyHistory: Emergency[];
    loading: boolean;
    error: string | null;
}

const initialState: EmergencyState = {
    activeEmergency: null,
    emergencyHistory: [],
    loading: false,
    error: null
};

const emergencySlice = createSlice({
    name: 'emergency',
    initialState,
    reducers: {
        setActiveEmergency: (state, action: PayloadAction<Emergency>) => {
            state.activeEmergency = action.payload;
        },
        clearActiveEmergency: (state) => {
            if (state.activeEmergency) {
                state.emergencyHistory.unshift(state.activeEmergency);
            }
            state.activeEmergency = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const {
    setActiveEmergency,
    clearActiveEmergency,
    setLoading,
    setError
} = emergencySlice.actions;

export default emergencySlice.reducer;
