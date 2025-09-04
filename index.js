const express = require("express");
const cors = require("cors");
const { server } = require("./config/config");
const apiRoutes = require("./mainRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || server.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// JSON parser
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send("<h1>DOGMA Diagnostic API is running ✅</h1>");
});

// API routes (all centralized in routes/index.js)
app.use("/api", apiRoutes);

// Start server (directly here since you don’t want server.js)
app.listen(server.port, () => {
  console.log(`🚀 Server running on port ${server.port}`);
});
