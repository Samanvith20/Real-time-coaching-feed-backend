import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import "dotenv/config";

import feedRoutes from "./routes/feedRoutes.js";

import connectDB from "./config/db.js";
import logger from "./config/logger.js";
import redis from "./config/redis.js";
import cloudinary from "./config/cloudinary.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());

app.use(express.json());

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Realtime Coaching Feed API running",
  });
});

// Routes
app.use("/feed", feedRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(
    JSON.stringify({
      message: err.message,
      stack: err.stack,
    })
  );

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Socket Events
io.on("connection", (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // MongoDB
    await connectDB();

    // Redis
    await redis.ping();

    logger.info("✅ Connected to Redis successfully");

    // Cloudinary
    await cloudinary.api.ping();

    logger.info("✅ Connected to Cloudinary successfully");

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    logger.error(`Startup Error: ${error.message}`);

    process.exit(1);
  }
};

startServer();