import express from "express";
import cors from "cors";

import { connectDB, disconnectDB } from "./src/config/db.js";
import bookingPrismaRouter from "./src/routes/bookingPrismaRoutes.js";
import roomRouter from "./src/routes/roomRoutes.js";
import authRouter from "./src/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";




dotenv.config();
connectDB();
const app = express();
console.log("BACKEND STARTED - ENV:", process.env.NODE_ENV);
// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
// app.use("/api/auth", authRoutes);
app.use("/auth", authRouter);
app.use("/api/booking", bookingPrismaRouter);
app.use("/api/room", roomRouter);
// app.use("/api/booking", bookingRouter);
// // Health check
app.use((err, req, res, next) => {
  console.error("API Error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

app.get("/", (req, res) => {
  res.send("API running");
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
