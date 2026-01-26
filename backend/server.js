require('dotenv').config();
const express = require('express');
const cors = require('cors');

// I import my modular route files
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// I enable CORS so the frontend and backend can talk
app.use(cors());
// I enable JSON parsing so I can read data sent from the frontend
app.use(express.json());

// I connect the Auth routes to the path /api/auth
app.use('/api/auth', authRoutes);
// I connect the Contact routes to the path /api/contacts
app.use('/api/contacts', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});