import express from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { getBookingHistory , login, register, logout, getProfile, editProfile, cancelBooking,forgotPassword,resetPassword } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
import { validateUserRegistration } from "../utils/validationMiddleware.js";
const router = express.Router();


router.post("/login", asyncWrapper(login));
router.post("/register", validateUserRegistration, asyncWrapper(register));
router.get("/logout", verifyToken, asyncWrapper(logout));
router.get("/getProfile", verifyToken, asyncWrapper(getProfile));
router.post("/editProfile", verifyToken, asyncWrapper(editProfile));

router.get("/history", verifyToken, asyncWrapper(getBookingHistory));
router.delete("/cancelBooking/:id", verifyToken, asyncWrapper(cancelBooking));
router.post("/forgotPassword", asyncWrapper(forgotPassword));
router.put("/resetPassword", asyncWrapper(resetPassword));

export default router;