const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection by getting one and releasing it.
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.stack);
    return;
  }
  if (connection) console.log(`Connected to MySQL database (ID: ${connection.threadId})`);
  if (connection) connection.release();
});

module.exports = pool.promise();