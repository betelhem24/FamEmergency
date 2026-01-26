const express = require('express');
// I create a router instance to handle paths for this specific file
const router = express.Router();
// I import our shared prisma connection from the db folder
const prisma = require('../db/prisma');
// I import bcrypt to handle password security
const bcrypt = require('bcrypt');

// I handle user registration at POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // The database automatically handles role and createdAt
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Email already exists." });
    }
    res.status(500).json({ error: "Internal Server Error during registration." });
  }
});

// I handle user login at POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
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
        role: user.role, 
      },
      token: "dummy-token-123" 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error during login" });
  }
});

module.exports = router;