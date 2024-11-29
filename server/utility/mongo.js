import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected; // Variable to track connection status

const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  const url = process.env.MONGO_URI;
  if (!url) throw new Error("MONGO_URI is not defined in .env file");

  // If already connected, return the existing connection
  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    // Use the Mongoose connect method to connect to the database
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Remove poolSize if you receive an error
      // Adjust serverSelectionTimeoutMS according to your needs
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true; // Update the connection status
    console.log("Connected to Database");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process on error
  }
};
export default async function connectToDatabase() {
    // Your existing code
  }
  