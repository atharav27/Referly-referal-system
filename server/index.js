import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import referalRouter from "./routes/referal.route.js";
import adminRouter from "./routes/admin.route.js";
import connectToDatabase from "./utility/mongo.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import serverless from "serverless-http"; // Use serverless-http to wrap Express in serverless function
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Connect to MongoDB
connectToDatabase();

// CORS configuration for allowed origins
const allowedOrigins = [
  "https://referly-referal-system-frontend.vercel.app", // Frontend URL
  "http://localhost:5173", // Local dev URL (if applicable)
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/referal", referalRouter);
app.use("/api/admin", adminRouter);

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err);
  }
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Wrap the app with serverless-http for Vercel deployment
export const handler = serverless(app);