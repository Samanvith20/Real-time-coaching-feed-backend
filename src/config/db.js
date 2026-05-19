import mongoose from "mongoose"

const connectDB = async () => {
  try {
    // Prevent multiple connections 
    if (mongoose.connection.readyState >= 1) {
      console.log("⚡ MongoDB already connected")
      return
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Maximum number of connections
      serverSelectionTimeoutMS: 5000, // Timeout if DB not reachable
      socketTimeoutMS: 45000,
    })

    
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message)

    // Exit app in production if DB fails
    process.exit(1)
  }
}

// Connection events
mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected")
})

mongoose.connection.on("error", (err) => {
  console.error("🔴 Mongoose error:", err.message)
})

mongoose.connection.on("disconnected", () => {
  console.warn("🟡 Mongoose disconnected")
})

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close()
  console.log("🔻 MongoDB connection closed due to app termination")
  process.exit(0)
})

export default connectDB