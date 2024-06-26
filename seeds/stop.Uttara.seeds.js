import mongoose from "mongoose";
import Stop from "../models/stop.model.js";
import Station from "../models/station.model.js";
import Schedule from "../models/schedule.model.js";
import Train from "../models/train.model.js";

const stationsData = [
  { name: "Colombo Fort", arrival: "11:40 am", departure: "11:50 am" },
  { name: "Gampaha", arrival: "12:21 pm", departure: "12:22 pm" },
  { name: "Polgahawela", arrival: "01:00 pm", departure: "01:03 pm" },
  { name: "Kurunegala", arrival: "01:25 pm", departure: "01:27 pm" },
  { name: "Maho", arrival: "02:06 pm", departure: "02:07 pm" },
  { name: "Galgamuwa", arrival: "02:38 pm", departure: "02:39 pm" },
  { name: "Thambuttegama", arrival: "03:06 pm", departure: "03:07 pm" },
  { name: "Anuradhapura", arrival: "03:43 pm", departure: "03:50 pm" },
  { name: "Vavuniya", arrival: "04:29 pm", departure: "04:30 pm" },
  { name: "Mankulam", arrival: "05:04 pm", departure: "05:05 pm" },
  { name: "Ariviya Nagar", arrival: "05:20 pm", departure: "05:21 pm" },
  { name: "Kilinochchi", arrival: "05:29 pm", departure: "05:30 pm" },
  { name: "Pallai", arrival: "05:51 pm", departure: "05:52 pm" },
  { name: "Kodikamam", arrival: "06:03 pm", departure: "06:04 pm" },
  { name: "Chavakachcheri", arrival: "06:10 pm", departure: "06:11 pm" },
  { name: "Jaffna", arrival: "06:23 pm", departure: "06:26 pm" },
  { name: "Kokuvil", arrival: "06:33 pm", departure: "06:34 pm" },
  { name: "Kondavil", arrival: "06:36 pm", departure: "06:37 pm" },
  { name: "Chunnakam", arrival: "06:40 pm", departure: "06:41 pm" },
  { name: "Mallakam", arrival: "06:45 pm", departure: "06:46 pm" },
  { name: "Tellippalai", arrival: "06:49 pm", departure: "06:50 pm" },
  { name: "Kankesanthurai", arrival: "06:53 pm", departure: "06:53 pm" },
];

const seedStops = async () => {
  const train = await Train.findOne({ name: "Uttara Devi" }); // Replace with your train name
  const relevantSchedules = await Schedule.find({ trainRef: train._id })
  const schedule = relevantSchedules[0]; 
  let price = 0; // Starting fare price

  for (let i = 0; i < stationsData.length; i++) {
    const stationData = stationsData[i];
    const station = await Station.findOne({ name: stationData.name });

    if (!station) {
      console.log(`Station not found: ${stationData.name}`);
      continue;
    }

    const stop = new Stop({
      scheduleRef: schedule._id,
      stationRef: station._id,
      arrivalTime: stationData.arrival,
      departureTime: stationData.departure,
      stopNumber: i + 1,
      platform: Math.floor(Math.random() * 5) + 1,
      price: price,
    });
    price += Math.floor(Math.random() * (50 - 10 + 1)) + 10;
    await stop.save();
  }
  console.log("Seeding complete!");
};

const dbUrl = "mongodb://127.0.0.1:27017/train-booking-test";

// Connect to MongoDB
mongoose
  .connect(dbUrl)
  .then(() => seedStops())
  .catch((err) => console.error(err))
  .finally(() => mongoose.disconnect());
