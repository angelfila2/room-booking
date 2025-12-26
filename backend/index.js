import express from "express";
import cors from "cors";
import loginRouter from "./src/routes/loginRouter.js";
import bookingRouter from "./src/routes/bookingRouter.js";
import authRouter from "./src/routes/auth.routes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();
console.log("🔥 BACKEND STARTED 🔥");
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
app.use("/api/booking", bookingRouter);
// // Health check
app.get("/", (req, res) => {
  res.send("API running");
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
