import mongoose from "mongoose";
import express from "express";
import allRoutes from "./routes/allRoutes.js";
import { releaseExpiredHolds } from "./controllers/allControllers.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const dbUrl = "mongodb://127.0.0.1:27017/TrainEaseDB";

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api", allRoutes);

// Periodic task to release expired booking holds
setInterval(releaseExpiredHolds, 60 * 1000); // Run every minute

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  //in ES6 if var and key are the same, you can just write the key
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
