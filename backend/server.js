require('dotenv').config();
const express = require('express');
const cors = require('cors');

// I import the modular routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// I apply middleware
app.use(cors());
app.use(express.json());

// I connect the routes to specific URL paths
// This keeps the server.js file very clean
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running professionally on port ${PORT}`);
});