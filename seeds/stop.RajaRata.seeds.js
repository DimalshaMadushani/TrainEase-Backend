import mongoose from "mongoose";
import Stop from "../models/stop.model.js";
import Station from "../models/station.model.js";
import Schedule from "../models/schedule.model.js";
import Train from "../models/train.model.js";

const stationsData = [
  { name: "Beliaththa", arrival: "08:45 am", departure: "08:45 am" },
  { name: "Wewurukannala", arrival: "08:55 am", departure: "08:56 am" },
  { name: "Bambaranda", arrival: "09:02 am", departure: "09:03 am" },
  { name: "Kakanadura", arrival: "09:10 am", departure: "09:11 am" },
  { name: "Matara", arrival: "09:17 am", departure: "09:20 am" },
  { name: "Kamburugamuwa", arrival: "09:26 am", departure: "09:27 am" },
  { name: "Weligama", arrival: "09:35 am", departure: "09:36 am" },
  { name: "Ahangama", arrival: "09:44 am", departure: "09:45 am" },
  { name: "Koggala", arrival: "09:50 am", departure: "09:51 am" },
  { name: "Thalpe", arrival: "09:55 am", departure: "09:56 am" },
  { name: "Galle", arrival: "10:05 am", departure: "10:25 am" },
  { name: "Hikkaduwa", arrival: "10:44 am", departure: "10:45 am" },
  { name: "Ambalangoda", arrival: "10:56 am", departure: "10:57 am" },
  { name: "Aluthgama", arrival: "11:19 am", departure: "11:20 am" },
  { name: "Kalutara South", arrival: "11:40 am", departure: "11:42 am" },
  { name: "Panadura", arrival: "12:03 pm", departure: "12:04 pm" },
  { name: "Mount Lavinia", arrival: "12:26 pm", departure: "12:27 pm" },
  { name: "Colombo Fort", arrival: "01:15 pm", departure: "01:16 pm" },
  { name: "Ragama", arrival: "01:37 pm", departure: "01:39 pm" },
  { name: "Gampaha", arrival: "01:52 pm", departure: "01:54 pm" },
  { name: "Veyangoda", arrival: "02:06 pm", departure: "02:08 pm" },
  { name: "Meerigama", arrival: "02:21 pm", departure: "02:22 pm" },
  { name: "Alawwa", arrival: "02:37 pm", departure: "02:38 pm" },
  { name: "Polgahawela", arrival: "02:48 pm", departure: "02:51 pm" },
  { name: "Anuradhapura", arrival: "03:30 pm", departure: "03:30 pm" },
];

const seedStops = async () => {
  const train = await Train.findOne({ name: "Rajarata Rajina" }); // Replace with your train name
  const relevantSchedules = await Schedule.find({ trainRef: train._id })
  const schedule = relevantSchedules[0]; // Replace with the correct schedule index
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
