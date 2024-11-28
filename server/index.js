import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import referalRouter from "./routes/referal.route.js";
import adminRouter from "./routes/admin.route.js";
// import listingRouter from "./routes/listing.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from 'express-rate-limit';

// import path from "path";
dotenv.config();

//connection to database
const MONGO_URI = process.env.MONGO_URI || "your-default-uri";
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.error("Connection failed!", error);
  });
// const corsOptions = {
//   origin: "http://localhost:5173", // Replace with your frontend's origin
//   credentials: true, // Allows cookies to be sent
// };
// const allowedOrigins = [
//   "https://referly-referal-system-frontend.vercel.app",
//   "http://localhost:5173", // for local development
// ];


const app = express();
app.use(cors({
  origin: "https://referly-referal-system-frontend.vercel.app",
  methods: ["POST", "GET"],
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

const dbLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
});


app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/user", dbLimiter, userRouter);
app.use("/api/auth", dbLimiter, authRouter);
app.use("/api/referal", dbLimiter, referalRouter);
app.use("/api/admin", dbLimiter, adminRouter);

// Middleware for parsing JSON
app.use(express.json());
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

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to Express Server!");
});

//declring port number for the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
