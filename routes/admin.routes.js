
import express from "express";
import { getBookingsByDate ,getBookingsByDateAndSchedule, getTrains,getRevenue,getUserRegistrations} from "../controllers/admin.controller.js";

const router = express.Router();
// for admin panel
router.get("/bookingsByDate", getBookingsByDate);
router.get("/bookingsByDateAndSchedule", getBookingsByDateAndSchedule);
router.get("/trains", getTrains);
router.get("/revenue", getRevenue);
router.get("/userRegistrations", getUserRegistrations);



export default router;