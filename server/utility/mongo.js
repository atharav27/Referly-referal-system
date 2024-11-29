import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// let isConnected; // Variable to track connection status

// Optimize database connection
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    return await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 5000,
      maxPoolSize: 3,
      bufferMaxEntries: 0,
    });
  } catch (error) {
    console.error("Database Connection Error:", error);
    throw error;
  }
};

export default connectToDatabase;
