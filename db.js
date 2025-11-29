const { Client } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

let client;

const isProd = process.env.NODE_ENV === "production";

// In production (Render), use DATABASE_URL with SSL
if (isProd && process.env.DATABASE_URL) {
  client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // Local development: use individual PG_* variables, no SSL
  client = new Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    port: process.env.PG_PORT,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  });
}

client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Database connection error:", err));

module.exports = client;
