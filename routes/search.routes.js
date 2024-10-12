import express from "express";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { getStations, getSchedules, getTrainDetails, getCoachDetails  } from "../controllers/search.controller.js";
import { verifyToken } from "../utils/verifyToken.js";
const router = express.Router();


// router.get("/stationName/:id", asyncWrapper(getStationName));
router.get("/stations", asyncWrapper(getStations)); // get all stations , thisis used in the search bar
router.get("/schedules", asyncWrapper(getSchedules));
router.get("/train-details", asyncWrapper(getTrainDetails));
router.get("/coach-details", verifyToken, asyncWrapper(getCoachDetails));

export default router;