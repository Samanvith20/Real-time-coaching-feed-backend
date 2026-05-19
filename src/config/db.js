import mongoose from "mongoose"
import logger from "./logger.js"

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      logger.error("❌ MongoDB URI missing. Please set MONGO_URI in .env")
      process.exit(1)
    }
    // Prevent multiple connections 
    if (mongoose.connection.readyState >= 1) {
      logger.info("⚡ MongoDB already connected")
      return
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Maximum number of connections
      serverSelectionTimeoutMS: 5000, // Timeout if DB not reachable
      socketTimeoutMS: 45000,
    })

    
  } catch (error) {
    logger.error("❌ MongoDB Connection Failed:", error.message)

    // Exit app in production if DB fails
    process.exit(1)
  }
}

// Connection events
mongoose.connection.on("connected", () => {
  logger.info("🟢 Connected to MongoDB successfully")
})

mongoose.connection.on("error", (err) => {
  logger.error("🔴 Mongoose error:", err.message)
})

mongoose.connection.on("disconnected", () => {
  logger.warn("🟡 Mongoose disconnected")
})

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close()
  logger.info("🔻 MongoDB connection closed due to app termination")
  process.exit(0)
})

export default connectDB