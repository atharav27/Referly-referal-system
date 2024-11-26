import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import referalRouter from "./routes/referal.route.js"
import adminRouter from "./routes/admin.route.js"
// import listingRouter from "./routes/listing.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// import path from "path";
dotenv.config();

//connection to database
mongoose
  .connect(
    "mongodb+srv://atharavbhawsar06:PfoWccZICJnHf8v2@referly.jsnib.mongodb.net/?retryWrites=true&w=majority&appName=Referly"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((error) => {
    console.error("Connection failed!", error);
  });
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend's origin
  credentials: true, // Allows cookies to be sent
};
const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/referal", referalRouter);
app.use("/api/admin", adminRouter);

// Middleware for parsing JSON
app.use(express.json());
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error ";
  return res.status(statusCode).json({
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
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
