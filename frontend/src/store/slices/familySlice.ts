import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FamilyMember {
    _id: string;
    familyMemberId: {
        _id: string;
        name: string;
        email: string;
    };
    relationship: string;
    status: 'PENDING' | 'ACCEPTED' | 'BLOCKED';
    permissions: {
        canViewLocation: boolean;
        canReceiveEmergency: boolean;
        canViewMedical: boolean;
    };
}

export interface FamilyState {
    members: FamilyMember[];
    loading: boolean;
    error: string | null;
}

const initialState: FamilyState = {
    members: [],
    loading: false,
    error: null
};

const familySlice = createSlice({
    name: 'family',
    initialState,
    reducers: {
        setFamilyMembers: (state, action: PayloadAction<FamilyMember[]>) => {
            state.members = action.payload;
        },
        addFamilyMember: (state, action: PayloadAction<FamilyMember>) => {
            state.members.push(action.payload);
        },
        removeFamilyMember: (state, action: PayloadAction<string>) => {
            state.members = state.members.filter(m => m._id !== action.payload);
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
    setFamilyMembers,
    addFamilyMember,
    removeFamilyMember,
    setLoading,
    setError
} = familySlice.actions;

export default familySlice.reducer;
