import express from "express";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import {
  getSchedules,
  getTrainDetails,
  getCoachDetails,
  getBookingHistory,
  login,
  register,
  logout,
  getStations,
  holdSeats,
  confirmBooking,
  getProfile,
  editProfile,
  cancelBooking,
  getStationName
} from "../controllers/allControllers.js";
import { verifyToken } from "../utils/verifyToken.js";
const router = express.Router();

router.get("/stationName/:id", asyncWrapper(getStationName));
router.get("/stations", asyncWrapper(getStations)); // get all stations , thisis used in the search bar
router.get("/schedules", asyncWrapper(getSchedules));
router.get("/train-details", asyncWrapper(getTrainDetails));
router.get("/coach-details", verifyToken, asyncWrapper(getCoachDetails));

router.post("/holdSeats", verifyToken, asyncWrapper(holdSeats));
router.get("/confirmBooking/:id", verifyToken, asyncWrapper(confirmBooking));

router.get("/user/history", verifyToken, asyncWrapper(getBookingHistory));
router.post("/login", asyncWrapper(login));
router.post("/register", asyncWrapper(register));
router.get("/logout", verifyToken, asyncWrapper(logout));
router.get("/user/getProfile", verifyToken, asyncWrapper(getProfile));
router.post("/user/editProfile", verifyToken, asyncWrapper(editProfile));
router.delete("/user/cancelBooking/:id", verifyToken, asyncWrapper(cancelBooking));

export default router;
