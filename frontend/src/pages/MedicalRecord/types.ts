export interface MedicalFormData {
    fullName: string;
    dateType: string;
    dob: string;
    bloodType: string;
    allergies: string;
    emergencyContact: string;
    relationship: string;
}

export interface MedicalFieldProps {
    formData: MedicalFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}
