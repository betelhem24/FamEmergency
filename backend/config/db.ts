import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

// REQUIREMENT: Stable Neon PostgreSQL connection with proper pooling
// Connection parameters are now configured in .env
const getDatabaseUrl = () => {
    return process.env.DATABASE_URL;
};

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
        db: {
            url: getDatabaseUrl(),
        },
    },
    // Connection pool configuration for Neon serverless
    // This prevents connection exhaustion and handles connection lifecycle properly
});

// Connection management with retry logic
let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log('[INFO] Neon PostgreSQL already connected');
        return;
    }

    const MAX_RETRIES = 10;
    const RETRY_DELAY_MS = 5000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`[DB_CONNECT] Attempt ${attempt}/${MAX_RETRIES}...`);
            await prisma.$connect();
            // Test the connection with a simple query
            await prisma.$queryRaw`SELECT 1`;
            isConnected = true;
            console.log('[SUCCESS] Neon PostgreSQL Connected');
            return;
        } catch (error: any) {
            const errorCode = error?.code;
            const errorMessage = error?.message || String(error);

            console.error(`[ERROR] Neon Database connection attempt ${attempt} failed:`, {
                code: errorCode,
                message: errorMessage
            });

            // Check for specific error codes: P1001 (Can't reach database) or "Closed"
            if (errorCode === 'P1001' || errorMessage.includes('Closed')) {
                if (attempt < MAX_RETRIES) {
                    console.log(`[RETRY] Waiting ${RETRY_DELAY_MS / 1000}s before retry...`);
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    continue;
                }
            }

            // If we've exhausted retries or it's a different error, exit
            console.error('[FATAL] Could not establish Neon PostgreSQL connection after retries');
            process.exit(1);
        }
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
