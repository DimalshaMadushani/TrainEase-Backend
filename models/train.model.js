import mongoose from "mongoose";

const trainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  coaches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
    },
  ],
});

const Train = mongoose.model("Train", trainSchema);

export default Train;
