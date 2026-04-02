// ============================================================
//  CONFIG/DB.JS — Database Connection & Table Creation
//  Uses mysql2 with connection pooling for efficiency.
// ============================================================

const mysql = require('mysql2/promise');

// Create a connection pool (reuses connections instead of creating new ones each time)
// Pool reads settings from the .env file
const pool = mysql.createPool({
  host:             process.env.DB_HOST     || '127.0.0.1',
  port:             process.env.DB_PORT     || 3306,     // Default MySQL port is 3306
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',
  database:         process.env.DB_NAME     || 'medisense',
  waitForConnections: true,
  connectionLimit:  10,   // Maximum 10 simultaneous connections
  queueLimit:       0,
  // Auto-reconnect settings
  enableKeepAlive:  true,
  keepAliveInitialDelay: 0
});

// ============================================================
//  INIT DB — Creates the database and all tables if they don't exist
//  Called once when the server starts
// ============================================================
const initDB = async () => {
  let connection;
  try {
    // Step 1: Connect WITHOUT specifying the database (it might not exist yet)
    connection = await mysql.createConnection({
      host:     process.env.DB_HOST     || '127.0.0.1',
      port:     parseInt(process.env.DB_PORT) || 3306,
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    // Step 2: Create the database if it doesn't already exist
    const dbName = process.env.DB_NAME || 'medisense';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);
    console.log(`✅ Database "${dbName}" is ready.`);

    // ---- TABLE 1: users ----
    // Stores all registered user accounts
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(255)        NOT NULL,
        email      VARCHAR(255) UNIQUE NOT NULL,
        password   VARCHAR(255)        NOT NULL,
        age        INT                 DEFAULT NULL,
        gender     VARCHAR(50)         DEFAULT NULL,
        created_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // ---- TABLE 2: chat_history ----
    // Stores every message (user + AI) for each user
    await connection.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT         NOT NULL,
        role       VARCHAR(50) NOT NULL,   -- 'user' or 'ai'
        message    TEXT        NOT NULL,
        created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // ---- TABLE 3: hospitals ----
    // Stores hospital data for the Nearby Hospitals feature
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(255)   NOT NULL,
        address    TEXT,
        lat        DECIMAL(10, 8) DEFAULT NULL,
        lng        DECIMAL(11, 8) DEFAULT NULL,
        rating     DECIMAL(3, 1)  DEFAULT 4.0,
        type       VARCHAR(100)   DEFAULT 'Private',
        phone      VARCHAR(50)    DEFAULT NULL,
        created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ---- TABLE 4: user_profiles ----
    // Stores extra profile info (medical history, etc.)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        user_id         INT  UNIQUE NOT NULL,
        blood_group     VARCHAR(10)  DEFAULT NULL,
        allergies       TEXT         DEFAULT NULL,
        medical_history TEXT         DEFAULT NULL,
        avatar_initials VARCHAR(5)   DEFAULT NULL,
        updated_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await connection.end();
    console.log('✅ All database tables are ready.');

  } catch (error) {
    if (connection) await connection.end().catch(() => {});
    // Re-throw so server.js can handle it
    throw error;
  }
};

// Export both pool (for queries) and initDB (called at startup)
module.exports = { pool, initDB };
