
import express from "express";
import { getBookingsByDate } from "../controllers/admin.controller.js";

const router = express.Router();
// for admin panel
router.get("/bookings/bookingsByDate", getBookingsByDate);

export default router;