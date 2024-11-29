import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

let isConnected = false; // Track connection status

// MongoDB URI from environment variables
const url = process.env.MONGO_URI;

// Ensure the URI is defined
if (!url) {
  console.error("MONGO_URI is not defined in .env file");
  throw new Error("MONGO_URI is not defined in .env file");
}

// Database connection function
const connectToDatabase = async () => {
  mongoose.set("strictQuery", true); // Mongoose v6+ option
  
  // Check for an existing connection
  if (isConnected || mongoose.connection.readyState) {
    console.log("Reusing existing database connection");
    return;
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });
    isConnected = true; // Update connection status
    console.log("Connected to Database");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process on connection error
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  if (isConnected) {
    await mongoose.connection.close();
    console.log("Database connection closed due to application termination");
  }
  process.exit(0);
});

export default connectToDatabase;
