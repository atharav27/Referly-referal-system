import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import referalRouter from "./routes/referal.route.js";
import adminRouter from "./routes/admin.route.js";
import connectToDatabase from "./utility/mongo.js";


  
import cookieParser from "cookie-parser";
import cors from "cors";
import serverless from "serverless-http";
import dotenv from "dotenv";
dotenv.config();

const app = express();


connectToDatabase();
// const corsOptions = {
//   origin: "http://localhost:5173", // Replace with your frontend's origin
//   credentials: true, // Allows cookies to be sent
// };
const allowedOrigins = [
  "https://referly-referal-system-frontend.vercel.app", // Production frontend
  "http://localhost:5173", // Development frontend
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

//routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/referal", referalRouter);
app.use("/api/admin", adminRouter);

// Middleware for parsing JSON
// app.use(express.json());
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

// export default app;
export default serverless(app);