import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log('Neon PostgreSQL connected successfully via Prisma');
    } catch (error) {
        console.error('Neon Database connection failed:', error);
        // Requirement: Throw error if connection fails to prevent starting with fake data
        process.exit(1);
    }
};

export default prisma;
