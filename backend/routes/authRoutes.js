const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');
const bcrypt = require('bcrypt');

// I handle user registration here
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// I handle login here
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: "dummy-token-123"
    });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
});

module.exports = router;