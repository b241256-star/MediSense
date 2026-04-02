// routes/authRoutes.js
const express = require('express');
const router  = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// POST /api/auth/register  ← Create new account
router.post('/register', registerUser);

// POST /api/auth/login     ← Sign in to existing account
router.post('/login', loginUser);

module.exports = router;
