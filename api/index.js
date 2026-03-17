const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('../config/db');

// Load env vars
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/users', require('../routes/users'));
app.use('/api/files', require('../routes/files'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Loan Admin API is running (Serverless Mode)' });
});

// Export the app for Vercel
module.exports = app;
