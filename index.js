import mongoose from "mongoose";
import express from "express";
import userRoutes from "./routes/user.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import searchRoutes from "./routes/search.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { releaseExpiredHolds } from "./controllers/utils/booking.utils.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// const dbUrl = "mongodb://127.0.0.1:27017/TrainEaseDB";
const dbUrl = process.env.DB_URL;
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.use(
  cors({
    origin: "https://trainease-admin-panel.onrender.com", // Allow requests from your frontend
    credentials: true, // Allow cookies and credentials
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes);

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

// // Update this part to listen on your private IP
// const PORT = 3000;
// const HOST = process.env.HOST;

// app.listen(PORT, HOST, () => {
//   console.log(`Server listening on http://${HOST}:${PORT}`);
// });
