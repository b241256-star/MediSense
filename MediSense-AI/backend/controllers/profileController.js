// ============================================================
//  CONTROLLERS/PROFILECONTROLLER.JS — User Profile Management
//  Handles getting and updating user profile data.
// ============================================================

const { pool } = require('../config/db');

// ============================================================
//  GET USER PROFILE
//  Route:  GET /api/profile
//  Access: Protected (JWT required)
// ============================================================
const getProfile = async (req, res) => {
  try {
    // Join users table with user_profiles for complete info
    const [rows] = await pool.query(
      `SELECT 
        u.id, u.name, u.email, u.age, u.gender, u.created_at,
        p.blood_group, p.allergies, p.medical_history
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get total chat count for the profile stats
    const [chatCount] = await pool.query(
      'SELECT COUNT(*) as total FROM chat_history WHERE user_id = ? AND role = ?',
      [req.user.id, 'user']
    );

    res.json({
      ...rows[0],
      total_chats: chatCount[0].total
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Error fetching profile.' });
  }
};

// ============================================================
//  UPDATE USER PROFILE
//  Route:  PUT /api/profile/update
//  Access: Protected (JWT required)
//  Body:   { name, age, gender, blood_group, allergies, medical_history }
// ============================================================
const updateProfile = async (req, res) => {
  try {
    const { name, age, gender, blood_group, allergies, medical_history } = req.body;

    // ---- Validate required fields ----
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name cannot be empty.' });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters.' });
    }

    const cleanName = name.trim();

    // ---- Update the main users table ----
    await pool.query(
      'UPDATE users SET name = ?, age = ?, gender = ? WHERE id = ?',
      [cleanName, age || null, gender || null, req.user.id]
    );

    // ---- Upsert (update or insert) the user_profiles table ----
    // INSERT ... ON DUPLICATE KEY UPDATE: if profile exists, update it; else create it
    await pool.query(
      `INSERT INTO user_profiles (user_id, blood_group, allergies, medical_history) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         blood_group = VALUES(blood_group),
         allergies = VALUES(allergies),
         medical_history = VALUES(medical_history)`,
      [req.user.id, blood_group || null, allergies || null, medical_history || null]
    );

    // Return the updated profile data
    res.json({
      id:             req.user.id,
      name:           cleanName,
      age:            age    || null,
      gender:         gender || null,
      blood_group:    blood_group    || null,
      allergies:      allergies      || null,
      medical_history: medical_history || null,
      message:        'Profile updated successfully!'
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Error updating profile. Please try again.' });
  }
};

module.exports = { getProfile, updateProfile };
