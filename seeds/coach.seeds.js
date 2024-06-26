import mongoose from "mongoose";
import Coach from "../models/coach.model.js";
import CoachType from "../models/coachType.model.js";
import Seat from "../models/seat.model.js";

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

async function populateCoaches() {
  // Find all coach types
  const coachTypes = await CoachType.find();
  const seatsArr = await Seat.find();

  // Assuming coach types are named 'First Class', 'Second Class', and 'Third Class'
  const firstClassType = coachTypes.find((type) => type.name === "First Class");
  const secondClassType = coachTypes.find(
    (type) => type.name === "Second Class"
  );
  const thirdClassType = coachTypes.find((type) => type.name === "Third Class");

  await Coach.insertMany([
    { coachNumber: 1, coachTypeRef: firstClassType._id, seats: seatsArr.slice(0, 20).map(seat => seat._id) },
    { coachNumber: 2, coachTypeRef: secondClassType._id, seats: seatsArr.slice(20, 40).map(seat => seat._id) },
    { coachNumber: 3, coachTypeRef: secondClassType._id, seats: seatsArr.slice(40, 60).map(seat => seat._id) },
    { coachNumber: 4, coachTypeRef: thirdClassType._id, seats: seatsArr.slice(60, 80).map(seat => seat._id) },
    { coachNumber: 5, coachTypeRef: thirdClassType._id, seats: seatsArr.slice(80, 100).map(seat => seat._id) },

    { coachNumber: 1, coachTypeRef: firstClassType._id, seats: seatsArr.slice(100, 120).map(seat => seat._id) },
    { coachNumber: 2, coachTypeRef: secondClassType._id, seats: seatsArr.slice(120, 140).map(seat => seat._id) },
    { coachNumber: 3, coachTypeRef: secondClassType._id, seats: seatsArr.slice(140, 160).map(seat => seat._id) },

    { coachNumber: 1, coachTypeRef: secondClassType._id, seats: seatsArr.slice(160, 180).map(seat => seat._id) },
    { coachNumber: 2, coachTypeRef: thirdClassType._id, seats: seatsArr.slice(180, 200).map(seat => seat._id) },
  ]);

  // Close the connection
  await mongoose.connection.close();
}

populateCoaches().catch((err) => console.error(err));
