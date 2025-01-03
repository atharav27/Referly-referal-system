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
// await connectToDatabase()

const allowedOrigins = [
  "https://referly-referal-system-frontend.vercel.app",
  "http://localhost:5173",
  // Add your frontend's exact deployment URL
];

app.use(cors({
  origin: function(origin, callback){
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
}));

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

export default serverless(app, {
  binary: ['*/*'], // Optional: handle binary responses
  resolver: async (req, res) => {
    try {
      // Ensure database connection before handling request
      await connectToDatabase();
    } catch (error) {
      console.error("Database connection error:", error);
      res.status(500).json({
        success: false,
        message: "Database Connection Failed"
      });
      return;
    }

    // Create a new Express instance for each request
    const handler = serverless(app);
    await handler(req, res);
  }
});