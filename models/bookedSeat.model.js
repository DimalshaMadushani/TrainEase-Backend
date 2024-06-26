import mongoose from "mongoose";

const bookedSeatSchema = new mongoose.Schema({
    bookingRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    seatRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
});

const BookedSeat = mongoose.model("BookedSeat", bookedSeatSchema);

export default BookedSeat;