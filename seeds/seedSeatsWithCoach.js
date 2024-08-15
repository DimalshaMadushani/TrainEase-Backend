import Coach from "../models/coach.model.js";
import Seat from "../models/seat.model.js";

const seedSeatsWithCoach = async () => {
    try{
        const coaches = await Coach.find();
    for (let coach of coaches) {
        for (let seat of coach.seats) {
            const foundSeat = await Seat.findById(seat);
            foundSeat.coachRef = coach._id;
            await foundSeat.save();
        }
    }
    console.log("Seats seeded with coach successfully");
    }
    catch (error) {
        console.error("Error seeding seats with coach:", error);
    }
    
}

export default seedSeatsWithCoach;