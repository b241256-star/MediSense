// routes/profileRoutes.js
const express = require('express');
const router  = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/profile         ← Get full profile info
router.get('/', protect, getProfile);

// PUT /api/profile/update  ← Update name, age, gender, etc.
router.put('/update', protect, updateProfile);

module.exports = router;
