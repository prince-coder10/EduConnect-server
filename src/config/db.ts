import mongoose from "mongoose";

export const connectDB = async () => {
  const connectionString = process.env.MONGO_URI!;
  try {
    await mongoose.connect(connectionString);
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
