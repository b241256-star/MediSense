const mysql = require('mysql2/promise');

let pool;

async function initDB() {
  try {
    // 👇 DIRECT URL use karo (no object, no host split)
    pool = mysql.createPool(process.env.DATABASE_URL);

    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();

  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    throw err;
  }
}

function getDB() {
  return pool;
}

module.exports = { initDB, getDB };