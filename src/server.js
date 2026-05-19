import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import feedRoutes from "./routes/feedRoutes.js";

import "dotenv/config";
import connectDB from "./config/db.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.io = io
  next()
})
// Routes

app.use("/feed", feedRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
