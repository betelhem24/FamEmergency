// INITIAL SETUP
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const app = express();
const prisma = new PrismaClient();

// MIDDLEWARE
app.use(cors()); 
app.use(express.json()); 

// USER REGISTRATION ROUTE
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

// USER LOGIN ROUTE
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

// CREATE CONTACT ROUTE
app.post('/contacts', async (req, res) => {
  const { name, phone, relation, userId } = req.body;

  console.log("--- New Contact Request ---");
  console.log("User ID:", userId);
  console.log("Name:", name);

  try {
    const newContact = await prisma.emergencyContact.create({
      data: {
        name: name,
        phone: phone,
        relation: relation,
        userId: parseInt(userId), 
      },
    });

    console.log("✅ Successfully saved to Database!");
    res.status(201).json(newContact);

  } catch (error) {
    console.error("❌ PRISMA SAVE ERROR:", error);
    res.status(500).json({ error: "Could not save contact. Please check backend logs." });
  }
});

// FETCH ALL CONTACTS FOR A USER ROUTE
app.get('/contacts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const contacts = await prisma.emergencyContact.findMany({
      where: { 
        userId: parseInt(userId) 
      },
    });

    res.json(contacts);
  } catch (error) {
    console.error("❌ FETCH ERROR:", error);
    res.status(500).json({ error: "Could not fetch contacts." });
  }
});

// UPDATE CONTACT ROUTE
// 'app.put' is the standard method for updating existing data.
app.put('/contacts/:id', async (req, res) => {
  //  Get the ID of the contact from the URL
  const { id } = req.params;
  // Get the new Name, Phone, and Relation from the request body
  const { name, phone, relation } = req.body;

  try {
    // 'prisma.emergencyContact.update' finds the row and changes it.
    const updatedContact = await prisma.emergencyContact.update({
      where: {
        id: parseInt(id), // Word: Find the contact with this ID
      },
      data: {
        name: name,         // Overwrite the old name with the new one
        phone: phone,       //  Overwrite the old phone
        relation: relation, //  Overwrite the old relation
      },
    });

    console.log("✏️ Contact updated in Database!");
    //  Send the updated contact back to the frontend
    res.json(updatedContact);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Could not update contact." });
  }
});

// DELETE CONTACT ROUTE
app.delete('/contacts/:id', async (req, res) => {
  //  'req.params' extracts the ID from the URL link
  const { id } = req.params;

  try {
    //  Prisma looks for the specific ID and removes it from the cloud
    await prisma.emergencyContact.delete({
      where: {
        id: parseInt(id), 
      },
    });

    console.log("🗑️ Contact deleted from Database!");
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Could not delete contact." });
  }
});

// SERVER STARTUP
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});