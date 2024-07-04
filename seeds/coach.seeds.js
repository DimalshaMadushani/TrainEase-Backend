
import Coach from "../models/coach.model.js";
import CoachType from "../models/coachType.model.js";
import Seat from "../models/seat.model.js";



async function createCoaches() {
  try {
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
    { coachNumber: 1, coachTypeRef: firstClassType._id, seats: seatsArr.slice(0, 24).map(seat => seat._id) },
    { coachNumber: 2, coachTypeRef: secondClassType._id, seats: seatsArr.slice(24, 48).map(seat => seat._id) },
    { coachNumber: 3, coachTypeRef: secondClassType._id, seats: seatsArr.slice(48, 72).map(seat => seat._id) },
    { coachNumber: 4, coachTypeRef: thirdClassType._id, seats: seatsArr.slice(72, 102).map(seat => seat._id) },
    { coachNumber: 5, coachTypeRef: thirdClassType._id, seats: seatsArr.slice(102, 132).map(seat => seat._id) },

    { coachNumber: 1, coachTypeRef: firstClassType._id, seats: seatsArr.slice(132, 156).map(seat => seat._id) },
    { coachNumber: 2, coachTypeRef: secondClassType._id, seats: seatsArr.slice(156, 180).map(seat => seat._id) },
    { coachNumber: 3, coachTypeRef: secondClassType._id, seats: seatsArr.slice(180, 204).map(seat => seat._id) },

    { coachNumber: 1, coachTypeRef: secondClassType._id, seats: seatsArr.slice(204, 228).map(seat => seat._id) },
    { coachNumber: 2, coachTypeRef: thirdClassType._id, seats: seatsArr.slice(228, 258).map(seat => seat._id) },
  ]);
  console.log("Coaches successfully populated");
  } catch (error) {
    console.error("Error populating coaches:", error);
  }
  
}



export default createCoaches;
