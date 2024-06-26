import mongoose from "mongoose";

const seat = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: [Number, Number],
    required: true,
  },
});

const Seat = mongoose.model("Seat", seat);

export default Seat;
