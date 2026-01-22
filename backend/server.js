// 1. INITIAL SETUP
require('dotenv').config(); // Load secrets from .env first!

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const app = express();
const prisma = new PrismaClient();

// 2. MIDDLEWARE
app.use(cors()); // Allow Frontend to talk to Backend
app.use(express.json()); // Allow Backend to read JSON data

// 3. THE REGISTRATION ROUTE
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password for safety
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Try to create the user in Neon Database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);

  } catch (error) {
    console.error("Database Error:", error);

    // 🔍 THE PRO ERROR CHECK:
    // P2002 is the specific Prisma code for "Unique constraint failed"
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: "This email is already registered. Please try logging in." 
      });
    }

    // General error for anything else
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
});

// 4. START THE SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});