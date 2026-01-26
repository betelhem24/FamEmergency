const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');

// I fetch all contacts for a specific user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const contacts = await prisma.emergencyContact.findMany({
      where: { userId: parseInt(userId) },
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// I create a new contact
router.post('/', async (req, res) => {
  const { name, phone, relation, userId } = req.body;
  try {
    const newContact = await prisma.emergencyContact.create({
      data: { name, phone, relation, userId: parseInt(userId) },
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: "Create failed" });
  }
});

// I add PUT and DELETE here as well... (I will keep them modular)
module.exports = router;