import { PrismaClient } from '@prisma/client';

// I initialize the Prisma Client to talk to Neon (SQL)
const prisma = new PrismaClient();

export default prisma;