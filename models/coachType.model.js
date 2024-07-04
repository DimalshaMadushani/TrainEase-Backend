import mongoose from "mongoose";

const coachTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    priceFactor: {
        type: Number,
        required: true,
    },
    facilities: {
        type: [String], // Array of strings to hold facilities for each class
        required: true,
    }

    });

const CoachType = mongoose.model("CoachType", coachTypeSchema);
export default CoachType;    