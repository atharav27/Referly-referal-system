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

const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000, // Extended socket timeout
      maxPoolSize: 10, // Connection pool size
      connectTimeoutMS: 10000, // Increased connection timeout
      retryWrites: true,
      w: "majority"
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    isConnected = true;
    console.log("Connected to Database");
  } catch (error) {
    console.error("Detailed Database Connection Error:", {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error; // Rethrow for Vercel error handling
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
