const mysql = require('mysql2/promise');

let pool;

async function initDB() {
  try {
    pool = mysql.createPool(process.env.DATABASE_URL);

    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();

  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    throw err;
  }
}

function getDB() {
  return pool;
}

module.exports = { initDB, getDB };