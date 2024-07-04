import express from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper.js';
import { getSchedules, getTrainDetails, getCoachDetails, getBookingHistory,login,register, logout } from "../controllers/allControllers.js";

const router = express.Router();

router.get('/schedules', asyncWrapper(getSchedules));
router.post('/train-details', asyncWrapper(getTrainDetails));
router.get('/coach-details', asyncWrapper(getCoachDetails));

router.get('/user/:id/history', asyncWrapper(getBookingHistory));
router.post('/login',asyncWrapper(login))
router.post('/register',asyncWrapper(register))
router.get('/logout',asyncWrapper(logout))

export default router;