import express from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { verifyToken } from "../utils/verifyToken.js";
import {
  getBookingsByDate,
  getBookingsByDateAndSchedule,
  getTrains,
  getRevenue,
  getUserRegistrations,
  login,
  logout,
  getProfile,
  getSchedule,
  notifyReschedule,
  getStationsOfSchedule,
} from "../controllers/admin.controller.js";
import { get } from "mongoose";

const router = express.Router();
// for admin panel
router.post("/login", asyncWrapper(login));
router.get("/getProfile", verifyToken, asyncWrapper(getProfile));
router.get("/logout", verifyToken, asyncWrapper(logout));
router.get("/bookingsByDate", verifyToken, asyncWrapper(getBookingsByDate));
router.get("/bookingsByDateAndSchedule", verifyToken, asyncWrapper(getBookingsByDateAndSchedule));
router.get("/trains", verifyToken, asyncWrapper(getTrains));
router.get("/revenue", verifyToken, asyncWrapper(getRevenue));
router.get("/userRegistrations", verifyToken, asyncWrapper(getUserRegistrations));
router.post("/notifyReschedule", verifyToken, asyncWrapper(notifyReschedule));
router.get("/stationsOfSchedule/:scheduleId", verifyToken, asyncWrapper(getStationsOfSchedule));

router.get("/schedules", getSchedule);

export default router;
