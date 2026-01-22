//  Load environment variables IMMEDIATELY
require('dotenv').config();

//  Import external tools
const express = require('express');
const cors = require('cors');

//  Import your internal files after dotenv is ready
const prisma = require('./db/prisma');
const bcrypt = require('bcrypt');

const app = express();

//  Middleware setup
app.use(cors());
app.use(express.json());

//  Routes

// Home route
app.get('/', (req, res) => {
  res.send('FamEmergency Server is Running!');
});

// GET route: Fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// POST route: Create a new user
app.post('/users', async (req, res) => {
  try {
    // Grab name, email, AND password from the request body
    const { name, email, password } = req.body; 

    // NEW: Scramble the password 10 times (10 "salts")
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword, // We save the HASH, not the real password!
      },
    });

    //   Send back the newly created user with a "201 Created" success code
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