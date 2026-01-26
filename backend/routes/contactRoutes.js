const express = require('express');
const router = express.Router();
const prisma = require('../db/prisma');

// I fetch all contacts for a specific user: GET /api/contacts/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const contacts = await prisma.emergencyContact.findMany({
      where: { userId: parseInt(userId) },
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch contacts." });
  }
});

// I create a new contact: POST /api/contacts
router.post('/', async (req, res) => {
  const { name, phone, relation, userId } = req.body;
  try {
    const newContact = await prisma.emergencyContact.create({
      data: {
        name: name,
        phone: phone,
        relation: relation,
        userId: parseInt(userId), 
      },
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: "Could not save contact." });
  }
});

// I update an existing contact: PUT /api/contacts/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, relation } = req.body;
  try {
    const updatedContact = await prisma.emergencyContact.update({
      where: { id: parseInt(id) },
      data: { name, phone, relation },
    });
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: "Could not update contact." });
  }
});

// I delete a contact: DELETE /api/contacts/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.emergencyContact.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete contact." });
  }
});

module.exports = router;