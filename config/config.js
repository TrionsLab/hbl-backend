require("dotenv").config();

module.exports = {
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "clinic",
    port: process.env.DB_PORT || 3306,
  },
  server: {
    port: process.env.PORT || 3000,
    allowedOrigins: [
      "http://localhost:5173",
      "https://dogma.trionlabs.xyz",
    ],
  },
};