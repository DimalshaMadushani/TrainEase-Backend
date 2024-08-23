
import express from "express";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import { verifyToken } from "../utils/verifyToken.js";
import { getBookingsByDate ,getBookingsByDateAndSchedule, getTrains,getRevenue,getUserRegistrations,login,logout,getProfile,getSchedule} from "../controllers/admin.controller.js";
import { get } from "mongoose";

const router = express.Router();
// for admin panel
router.post("/login",asyncWrapper(login))
router.get("/getProfile", verifyToken, asyncWrapper(getProfile));
router.get("/logout",verifyToken,asyncWrapper(logout))
router.get("/bookingsByDate", getBookingsByDate);
router.get("/bookingsByDateAndSchedule", getBookingsByDateAndSchedule);
router.get("/trains", getTrains);
router.get("/revenue", getRevenue);
router.get("/userRegistrations", getUserRegistrations);

router.get("/schedules",getSchedule);



export default router;