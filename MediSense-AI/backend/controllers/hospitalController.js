// ============================================================
//  CONTROLLERS/HOSPITALCONTROLLER.JS — Nearby Hospitals Logic
//  Returns hospitals from DB, sorted by distance if location provided.
// ============================================================

const { pool } = require('../config/db');

// ---- Sample hospital data for Jaipur (seeded on first run) ----
const SAMPLE_HOSPITALS = [
  { name: 'SMS Government Hospital',       address: 'Sawai Ram Singh Rd, Jaipur', lat: 26.9124, lng: 75.7873, rating: 4.2, type: 'Government', phone: '0141-2518032' },
  { name: 'Fortis Escorts Hospital',       address: 'Jawaharlal Nehru Marg, Jaipur', lat: 26.8520, lng: 75.8010, rating: 4.7, type: 'Private',     phone: '0141-2547000' },
  { name: 'Narayana Multispeciality',      address: 'Sector 28, Kumbha Marg, Jaipur', lat: 26.8626, lng: 75.7588, rating: 4.5, type: 'Private',     phone: '0141-2972000' },
  { name: 'Apex Hospital',                 address: 'SP-4, Malviya Nagar, Jaipur', lat: 26.8623, lng: 75.8075, rating: 4.6, type: 'Private',     phone: '0141-2750000' },
  { name: 'RUHS College Medical Sciences', address: 'Sector 11, Pratap Nagar, Jaipur', lat: 26.7895, lng: 75.8283, rating: 4.1, type: 'Government', phone: '0141-2706000' },
  { name: 'Santokba Durlabhji Hospital',   address: 'Bhawani Singh Rd, Jaipur', lat: 26.8780, lng: 75.8003, rating: 4.4, type: 'Private',     phone: '0141-2566251' },
  { name: 'Mahatma Gandhi Hospital',       address: 'Sitapura, Jaipur', lat: 26.7993, lng: 75.8504, rating: 3.9, type: 'Government', phone: '0141-2771000' },
  { name: '24/7 Emergency Clinic',         address: 'MI Road, Jaipur Central', lat: 26.9058, lng: 75.7873, rating: 4.0, type: 'Emergency',   phone: '0141-2365900' },
  { name: 'Sunrise Clinic & Diagnostics',  address: 'Vaishali Nagar, Jaipur', lat: 26.9200, lng: 75.7400, rating: 4.3, type: 'Clinic',      phone: '0141-2356789' },
  { name: 'Apollo Clinic Jaipur',          address: 'C-Scheme, Jaipur', lat: 26.9050, lng: 75.8100, rating: 4.5, type: 'Clinic',      phone: '1860-500-4424' },
];

// ---- Haversine formula: calculates distance between two GPS coordinates ----
// Returns distance in kilometers
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); // Round to 1 decimal place
};

// ============================================================
//  GET NEARBY HOSPITALS
//  Route:  POST /api/hospitals/nearby
//  Access: Public (no login required)
//  Body:   { lat: 26.91, lng: 75.78 }  ← Optional: user's location
// ============================================================
const getNearbyHospitals = async (req, res) => {
  try {
    // ---- Check if hospitals exist in DB, seed if empty ----
    let [hospitals] = await pool.query('SELECT * FROM hospitals');

    if (hospitals.length === 0) {
      console.log('Seeding hospitals table with sample data...');
      
      const insertPromises = SAMPLE_HOSPITALS.map(h =>
        pool.query(
          'INSERT INTO hospitals (name, address, lat, lng, rating, type, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [h.name, h.address, h.lat, h.lng, h.rating, h.type, h.phone]
        )
      );
      await Promise.all(insertPromises);

      // Re-fetch after seeding
      [hospitals] = await pool.query('SELECT * FROM hospitals');
      console.log(`✅ Seeded ${hospitals.length} hospitals.`);
    }

    // ---- If user provided their location, calculate distances ----
    const { lat, lng } = req.body;

    if (lat && lng) {
      // Add distance to each hospital and sort by nearest first
      const withDistance = hospitals.map(h => ({
        ...h,
        distance_km: parseFloat(haversineDistance(lat, lng, h.lat, h.lng))
      })).sort((a, b) => a.distance_km - b.distance_km);

      return res.json(withDistance);
    }

    // ---- No location provided: return all hospitals ----
    res.json(hospitals);

  } catch (error) {
    console.error('Hospital Error:', error);
    res.status(500).json({ message: 'Error fetching hospitals. Please try again.' });
  }
};

module.exports = { getNearbyHospitals };
