const connectToDatabase = async (retries = 3) => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      retryReads: true,
    });
    isConnected = true;
    console.log("Connected to Database");
  } catch (error) {
    console.error("Database connection error:", error);
    if (retries > 0) {
      console.log(`Retrying connection. Attempts left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return connectToDatabase(retries - 1);
    }
    process.exit(1);
  }
};