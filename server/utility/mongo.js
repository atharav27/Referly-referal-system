import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Ensure environment variables are loaded at the very beginning

let isConnected = false; // Variable to track connection status

// Get the MongoDB URI from environment variables
const url =process.env.MONGO_URI;
console.log("MongoDB URI:", url); // Log to check if it's being loaded

// Check if MONGO_URI is not defined
if (!url) {
  console.error("MONGO_URI is not defined in .env file");
  throw new Error("MONGO_URI is not defined in .env file");
}

// Define and export the connection function
const connectToDatabase = async () => {
  mongoose.set("strictQuery", true); // Mongoose v6+ use this option

  // If already connected, return the existing connection
  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    // Use the Mongoose connect method to connect to the database
    await mongoose.connect(url, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no servers are found
    });
    isConnected = true; // Update the connection status
    console.log("Connected to Database");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process on error
  }
};

export default connectToDatabase;
