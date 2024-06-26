import mongoose from "mongoose";

const stationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    }
);

const Station = mongoose.model("Station", stationSchema);

export default Station;