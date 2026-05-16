require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes  = require("./routes/auth");
const userRoutes  = require("./routes/user");
const noteRoutes  = require("./routes/notes");
const aiRoutes    = require("./routes/ai");

// ── Connect Database ──────────────────────────────
connectDB();

const app = express();

// ── Security & Logging ────────────────────────────
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ── CORS ──────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// ── Body Parser ───────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { error: "Too many requests — slow down a bit! 🐢" },
});
app.use("/api", limiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 20,
  message: { error: "AI rate limit hit — wait a moment ⏳" },
});
app.use("/api/ai", aiLimiter);

// ── Routes ────────────────────────────────────────
app.use("/api/auth",  authRoutes);
app.use("/api/user",  userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/ai",    aiRoutes);

// ── Health Check ──────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ──────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀  Peblo Backend running on port ${PORT} [${process.env.NODE_ENV}]`);
});

module.exports = app;
