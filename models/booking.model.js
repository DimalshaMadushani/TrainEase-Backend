import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scheduleRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stop",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stop",
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ["confirmed", "cancelled", "hold"],
  },
  seats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
    },
  ],
  paymentId: String,
  holdExpiry: {
    type: Date,
  },
});

// Virtual property to calculate ticket price
bookingSchema.virtual("ticketPrice").get(function () {
  return this.totalAmount / this.seats.length;
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
