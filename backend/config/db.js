import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // <-- MUST be called before using process.env

export const connectWithDB = async () => {
  console.log("MONGO_URL:", process.env.MONGO_URL); // should log the value

  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`✅ Connected to database: ${conn.connection.name}`);
  } catch (err) {
    console.error("❌ DB connection failed");
    console.error(err);
    process.exit(1);
  }
};
