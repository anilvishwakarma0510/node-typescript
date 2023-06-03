import mongoose from "mongoose";
import { config } from "dotenv";
config();

const MONGO_URL: string = String(process.env.MONGO_URL);


const connection = async () => {
  try {
    await mongoose.connect(MONGO_URL,{
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

export default connection;
