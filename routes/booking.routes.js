import express from "express";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import { holdSeats, confirmBooking } from "../controllers/booking.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/holdSeats", verifyToken, asyncWrapper(holdSeats));
router.post("/confirmBooking/:id", verifyToken, asyncWrapper(confirmBooking));


export default router;