import QRCode from 'qrcode';

interface PatientQRData {
    id: string;
    name: string;
    age?: number;
    bloodType: string;
    allergies: string[];
    conditions: string[];
    medications?: { name: string; dosage: string; frequency: string }[];
    emergencyContacts: { name: string; phone: string; relationship: string }[];
}

export const generatePatientQR = async (data: PatientQRData): Promise<string> => {
    try {
        // Create JSON string of patient data
        const jsonData = JSON.stringify(data);

        // Generate QR code as base64 data URL
        const qrCodeDataURL = await QRCode.toDataURL(jsonData, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        return qrCodeDataURL;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
};

export const generatePatientQRBuffer = async (data: PatientQRData): Promise<Buffer> => {
    try {
        const jsonData = JSON.stringify(data);
        const buffer = await QRCode.toBuffer(jsonData, {
            errorCorrectionLevel: 'H',
            type: 'png',
            width: 400,
            margin: 2
        });

        return buffer;
    } catch (error) {
        console.error('Error generating QR code buffer:', error);
        throw new Error('Failed to generate QR code');
    }
};
