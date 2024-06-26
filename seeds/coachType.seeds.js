import mongoose from "mongoose";
import coachType from "../models/coachType.model.js";

const dbUrl = "mongodb://127.0.0.1:27017/train-booking-test";

// Connect to MongoDB
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const coachTypes = [
  { name: "First Class", priceFactor: 4 },
  { name: "Second Class", priceFactor: 2 },
  { name: "Third Class", priceFactor: 1 },
];

const createCoachTypes = async () => {
  try {
    // Check if coachTypes already exist
    const existingCoachTypes = await coachType.find({});
    if (existingCoachTypes.length > 0) {
      console.log("CoachTypes already populated");
      return;
    }

    // Create coachType instances
    await coachType.insertMany(coachTypes);

    console.log("CoachTypes successfully populated");
  } catch (error) {
    console.error("Error populating coachTypes:", error);
  } finally {
    mongoose.connection.close();
  }
};

createCoachTypes();
