import express from 'express';
import { asyncWrapper } from '../utils/AsyncWrapper.js';
import { getSchedules, getTrainDetails, getCoachDetails, getBookingHistory } from "../controllers/allControllers.js";

const router = express.Router();

router.get('/schedules', asyncWrapper(getSchedules));
router.get('/train-details', asyncWrapper(getTrainDetails));
router.get('/coach-details', asyncWrapper(getCoachDetails));


router.get('/user/:id/history', asyncWrapper(getBookingHistory));

export default router;