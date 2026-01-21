// 1. Load environment variables IMMEDIATELY
require('dotenv').config();

// 2. Import external tools
const express = require('express');
const cors = require('cors');

// 3. Import your internal files AFTER dotenv is ready
const prisma = require('./db/prisma');

const app = express();

// 4. Middleware setup
app.use(cors());
app.use(express.json());

// 5. Routes
app.get('/', (req, res) => {
  res.send('FamEmergency Server is Running!');
});

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});