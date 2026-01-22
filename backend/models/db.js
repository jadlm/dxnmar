const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || process.env.DB_PASS || "",
  database: process.env.DB_NAME || "dxn",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
