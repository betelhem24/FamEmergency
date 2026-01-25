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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);

  } catch (error) {
    console.error("Database Error:", error.code);
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: "This email is already registered. Please try logging in." 
      });
    }
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
});

// 4. THE LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: "dummy-token-123" 
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
});

// 5. THE EMERGENCY CONTACT ROUTES (NEW SECTION)
// Word-by-Word: We create a POST route for the frontend to send new contact data
app.post('/contacts', async (req, res) => {
  const { name, phone, relation, userId } = req.body;

  try {
    // Word-by-Word: await means we wait for the database to finish creating the contact
    const newContact = await prisma.emergencyContact.create({
      data: {
        name: name,
        phone: phone,
        relation: relation,
        userId: parseInt(userId), // Word: parseInt turns the ID text into a number
      },
    });

    // Word: res.status(201) means "Created successfully"
    res.status(201).json(newContact);

  } catch (error) {
    console.error("Error saving contact:", error);
    res.status(500).json({ error: "Could not save contact. Please try again." });
  }
});

// Word-by-Word: We create a GET route to load contacts for a specific user
app.get('/contacts/:userId', async (req, res) => {
  const { userId } = req.params; // Word: params grabs the ID from the URL link

  try {
    // Word-by-Word: findMany finds ALL items that match the rule in 'where'
    const contacts = await prisma.emergencyContact.findMany({
      where: { 
        userId: parseInt(userId) 
      },
    });

    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Could not fetch contacts." });
  }
});

// 6. START THE SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});