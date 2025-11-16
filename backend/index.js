import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connectWithDB} from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/index.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 4000;

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json());
app.use(cookieParser());

connectWithDB();

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  }).on('error', (err) => {
    console.error('❌ Server failed to start:', err);
  });

  app.get("/", (req, res) => {
    res.send("✅ EVENTORA backend is running");
  });