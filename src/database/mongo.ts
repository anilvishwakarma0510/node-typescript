import mongoose from "mongoose";
import { config } from "dotenv";
config();
import CONSTANTS from "../constants/constants";

const MONGO_URL: string = String(process.env.MONGO_URL);


const connection = async () => {
  try {
    await mongoose.connect(MONGO_URL,{
      serverSelectionTimeoutMS: 30000,
    });
  } catch (error) {
    console.error(CONSTANTS.DB_ERROR, error);
  }
};

export default connection;
