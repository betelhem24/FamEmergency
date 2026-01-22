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

// NEW: Create a new user in the database
app.post('/users', async (req, res) => {
  try {
    // 1. Get the data from the request body (what the user typed)
    const { name, email } = req.body; 

    // 2. Use Prisma to save this data into the Neon database
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
      },
    });

    // 3. Send back the newly created user with a "201 Created" success code
    res.status(201).json(newUser);
    
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ error: "Could not create user" });
  }
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});