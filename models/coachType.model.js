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
    });

const CoachType = mongoose.model("CoachType", coachTypeSchema);
export default CoachType;    