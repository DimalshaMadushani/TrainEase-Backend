import express from "express";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import { getBookingHistory , login, register, logout, getProfile, editProfile, cancelBooking } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
const router = express.Router();


router.post("/login", asyncWrapper(login));
router.post("/register", asyncWrapper(register));
router.get("/logout", verifyToken, asyncWrapper(logout));
router.get("/getProfile", verifyToken, asyncWrapper(getProfile));
router.post("/editProfile", verifyToken, asyncWrapper(editProfile));

router.get("/history", verifyToken, asyncWrapper(getBookingHistory));
router.delete("/cancelBooking/:id", verifyToken, asyncWrapper(cancelBooking));

export default router;