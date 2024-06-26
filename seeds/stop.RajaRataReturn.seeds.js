import mongoose from "mongoose";
import Stop from "../models/stop.model.js";
import Station from "../models/station.model.js";
import Schedule from "../models/schedule.model.js";
import Train from "../models/train.model.js";

const stationsData = [
    {name: "Anuradhapura", arrival: "08:00 am", departure: "08:10 am"},
  { name: "Polgahawela", arrival: "08:42 am", departure: "08:44 am" },
  { name: "Alawwa", arrival: "08:54 am", departure: "08:55 am" },
  { name: "Meerigama", arrival: "09:10 am", departure: "09:11 am" },
  { name: "Veyangoda", arrival: "09:24 am", departure: "09:26 am" },
  { name: "Gampaha", arrival: "09:38 am", departure: "09:40 am" },
  { name: "Ragama", arrival: "09:52 am", departure: "09:54 am" },
  { name: "Colombo Fort", arrival: "10:20 am", departure: "10:30 am" },
  { name: "Mount Lavinia", arrival: "10:45 am", departure: "10:46 am" },
  { name: "Panadura", arrival: "11:05 am", departure: "11:07 pm" },
  { name: "Kalutara South", arrival: "11:27 am", departure: "11:28 pm" },
  { name: "Aluthgama", arrival: "11:48 am", departure: "11:50 am" },
  { name: "Ambalangoda", arrival: "12:11 pm", departure: "12:12 pm" },
  { name: "Hikkaduwa", arrival: "12:22 pm", departure: "12:23 pm" },
  { name: "Galle", arrival: "12:42 pm", departure: "01:00 pm" },
  { name: "Thalpe", arrival: "01:10 pm", departure: "01:11 pm" },
  { name: "Koggala", arrival: "01:15 pm", departure: "01:16 pm" },
  { name: "Ahangama", arrival: "01:20 pm", departure: "01:21 pm" },
  { name: "Weligama", arrival: "01:31 pm", departure: "01:32 pm" },
  { name: "Kamburugamuwa", arrival: "01:40 pm", departure: "01:44 pm" },
  { name: "Matara", arrival: "01:54 pm", departure: "02:00 pm" },
  { name: "Piladuwa", arrival: "02:02 pm", departure: "02:03 pm" },
  { name: "Weherahena", arrival: "02:06 pm", departure: "02:07 pm" },
  { name: "Kakanadura", arrival: "02:10 pm", departure: "02:11 pm" },
  { name: "Bambaranda", arrival: "02:18 pm", departure: "02:19 pm" },
  { name: "Wewurukannala", arrival: "02:24 pm", departure: "02:25 pm" },
  { name: "Beliaththa", arrival: "02:35 pm", departure: "02:35 pm" },
];

const seedStops = async () => {
  const train = await Train.findOne({ name: "Rajarata Rajina" }); // Replace with your train name
  const relevantSchedules = await Schedule.find({ trainRef: train._id })
  const schedule = relevantSchedules[1]; // Replace with the correct schedule index
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
