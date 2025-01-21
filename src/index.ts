import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blog";
import swaggerDocs from "./utils/swagger";
import { errorHandler } from "./utils/errorHandler";
import connectDB from "./lib/connectDB";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection and server start
app.listen(PORT, () => {
  connectDB();
  swaggerDocs(app, PORT as number);
  console.log("Server is Running!");
});
