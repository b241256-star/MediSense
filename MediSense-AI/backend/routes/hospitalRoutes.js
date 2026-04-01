// routes/hospitalRoutes.js
const express = require('express');
const router  = express.Router();
const { getNearbyHospitals } = require('../controllers/hospitalController');

// POST /api/hospitals/nearby  ← Get hospitals sorted by distance
router.post('/nearby', getNearbyHospitals);

module.exports = router;
