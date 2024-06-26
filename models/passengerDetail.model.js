import mongoose from "mongoose";

const passengerDetailSchema = new mongoose.Schema({
    bookingRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        required: true,
    },

    gender: {
        type: String,
        required: true,
        enum:['male','female']
    },

});

const PassengerDetail = mongoose.model("PassengerDetail", passengerDetailSchema);
export default PassengerDetail;