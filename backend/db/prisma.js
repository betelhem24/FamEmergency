// I import the PrismaClient tool from the library I installed
const { PrismaClient } = require('@prisma/client');

// I create a single instance of the PrismaClient
// I do this once here so I can share it across my whole app
const prisma = new PrismaClient();

// I export the prisma instance so other files like server.js can use it
module.exports = prisma;