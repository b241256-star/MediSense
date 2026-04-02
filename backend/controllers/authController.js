const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { getDB } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'medisense_secret_key', { expiresIn: '30d' });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;
    console.log('📝 Register request:', { name, email });

    if (!name || !name.trim()) return res.status(400).json({ message: 'Full name is required.' });
    if (!email || !isValidEmail(email.trim())) return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const cleanEmail = email.trim().toLowerCase();
    const cleanName  = name.trim();

    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existingUsers.length > 0) return res.status(400).json({ message: 'An account with this email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, age, gender) VALUES (?, ?, ?, ?, ?)',
      [cleanName, cleanEmail, hashedPassword, age || null, gender || null]
    );

    console.log('✅ User registered with ID:', result.insertId);

    await db.query('INSERT IGNORE INTO user_profiles (user_id) VALUES (?)', [result.insertId]);

    res.status(201).json({
      id:     result.insertId,
      name:   cleanName,
      email:  cleanEmail,
      age:    age    || null,
      gender: gender || null,
      token:  generateToken(result.insertId)
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔑 Login request:', { email });

    if (!email || !password) return res.status(400).json({ message: 'Please enter email and password.' });

    const cleanEmail = email.trim().toLowerCase();
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    const user = users[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('✅ Login success for user:', user.id);
      res.json({
        id:     user.id,
        name:   user.name,
        email:  user.email,
        age:    user.age,
        gender: user.gender,
        token:  generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = { registerUser, loginUser };
