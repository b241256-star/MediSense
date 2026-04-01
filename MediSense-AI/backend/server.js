// ============================================================
//  SERVER.JS — MediSense AI Main Server Entry Point
//  This is the starting point of the backend.
//  Run: node server.js   (or: npm start)
// ============================================================

// Load environment variables from .env file FIRST (before anything else)
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { initDB } = require('./config/db');

// ---- Import Route Files ----
const authRoutes     = require('./routes/authRoutes');
const chatRoutes     = require('./routes/chatRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const profileRoutes  = require('./routes/profileRoutes');

const app = express();

// ============================================================
//  MIDDLEWARE (runs before every request)
// ============================================================

// Allow requests from any origin (frontend calling the backend)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Serve the frontend files statically so you can open:
//   http://localhost:5000   ← loads the frontend automatically
app.use(express.static(path.join(__dirname, '../frontend')));

// ============================================================
//  API ROUTES
// ============================================================
app.use('/api/auth',      authRoutes);      // Register / Login
app.use('/api/chat',      chatRoutes);      // Chat with AI
app.use('/api/hospitals', hospitalRoutes);  // Nearby hospitals
app.use('/api/profile',   profileRoutes);   // Update profile

// Base health-check route
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'MediSense AI API is running ✅' });
});

// Catch-all: serve the frontend for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ============================================================
//  GLOBAL ERROR HANDLER
//  Catches any unhandled errors from routes/controllers
// ============================================================
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// ============================================================
//  START SERVER
// ============================================================
const PORT = process.env.PORT || 5000;

// First initialize the database, then start the server
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log('\n✅ MediSense AI Server is running!');
      console.log(`📡 Backend API: http://localhost:${PORT}/api`);
      console.log(`🌐 Frontend:    http://localhost:${PORT}`);
      console.log('─────────────────────────────────────────');
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
        console.log('⚠️  GEMINI_API_KEY not set. AI will run in demo mode.');
        console.log('   Get a free key from: https://aistudio.google.com/app/apikey');
        console.log('   Then add it to backend/.env file and restart the server.');
      } else {
        console.log('🤖 Gemini AI is connected and ready!');
      }
      console.log('─────────────────────────────────────────\n');
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database. Is MySQL running?');
    console.error('   Make sure: MySQL is ON, credentials in .env are correct.');
    console.error(err.message);
    process.exit(1); // Stop if DB connection fails
  });
