import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

// REQUIREMENT: Stable Neon PostgreSQL connection with proper pooling
const prisma = new PrismaClient({
    log: ['error', 'warn'], // Reduced logging to prevent spam
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// Connection management with retry logic
let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log('[INFO] Neon PostgreSQL already connected');
        return;
    }

    try {
        await prisma.$connect();
        // Test the connection with a simple query
        await prisma.$queryRaw`SELECT 1`;
        isConnected = true;
        console.log('[SUCCESS] Neon PostgreSQL Connected');
    } catch (error) {
        console.error('[ERROR] Neon Database connection failed:', error);
        // Requirement: Throw error if connection fails to prevent starting with fake data
        process.exit(1);
    }
};

// Graceful shutdown handler
export const disconnectDB = async () => {
    if (isConnected) {
        await prisma.$disconnect();
        isConnected = false;
        console.log('[INFO] Neon PostgreSQL disconnected');
    }
};

// Handle process termination
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await disconnectDB();
    process.exit(0);
});

export default prisma;
