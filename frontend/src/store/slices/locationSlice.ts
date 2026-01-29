import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Location {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
}

export interface FamilyLocation {
    userId: string;
    name: string;
    location: Location | null;
}

export interface LocationState {
    myLocation: Location | null;
    familyLocations: FamilyLocation[];
    isTracking: boolean;
    error: string | null;
}

const initialState: LocationState = {
    myLocation: null,
    familyLocations: [],
    isTracking: false,
    error: null
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setMyLocation: (state, action: PayloadAction<Location>) => {
            state.myLocation = action.payload;
        },
        setFamilyLocations: (state, action: PayloadAction<FamilyLocation[]>) => {
            state.familyLocations = action.payload;
        },
        updateFamilyLocation: (state, action: PayloadAction<FamilyLocation>) => {
            const index = state.familyLocations.findIndex(
                f => f.userId === action.payload.userId
            );
            if (index !== -1) {
                state.familyLocations[index] = action.payload;
            } else {
                state.familyLocations.push(action.payload);
            }
        },
        setTracking: (state, action: PayloadAction<boolean>) => {
            state.isTracking = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const {
    setMyLocation,
    setFamilyLocations,
    updateFamilyLocation,
    setTracking,
    setError
} = locationSlice.actions;

export default locationSlice.reducer;
