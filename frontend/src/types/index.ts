export interface User {
    id: string;
    name: string;
    email: string;
    role: 'PATIENT' | 'DOCTOR';
    avatar?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface EmergencyContact {
    id: string;
    name: string;
    phone: string;
    relationship: string;
}

export interface MedicalProfile {
    fullName?: string;
    age?: string;
    gender?: string;
    bloodType: string;
    height: string;
    weight: string;
    allergies: string[];
    conditions: string[];
    medications: {
        name: string;
        dosage: string;
        frequency: string;
    }[];
    contacts: EmergencyContact[];
    images?: {
        id: string;
        url: string;
        title: string;
        uploadedAt: string;
    }[];
}
