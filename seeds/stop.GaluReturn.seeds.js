import mongoose from "mongoose";
import Stop from "../models/stop.model.js";
import Station from "../models/station.model.js";
import Schedule from "../models/schedule.model.js";
import Train from "../models/train.model.js";

const stationsData = [
  { name: "Maradana", arrival: "04:40 pm", departure: "04:40 pm" },
  { name: "Colombo Fort", arrival: "04:45 pm", departure: "05:05 pm" },
  { name: "Dehiwala", arrival: "05:19 pm", departure: "05:20 pm" },
  { name: "Mount Lavinia", arrival: "05:23 pm", departure: "05:24 pm" },
  { name: "Ratmalana", arrival: "05:27 pm", departure: "05:28 pm" },
  { name: "Moratuwa", arrival: "05:33 pm", departure: "05:34 pm" },
  { name: "Panadura", arrival: "05:44 pm", departure: "05:45 pm" },
  { name: "Wadduwa", arrival: "05:52 pm", departure: "05:53 pm" },
  { name: "Kalutara North", arrival: "06:04 pm", departure: "06:05 pm" },
  { name: "Kalutara South", arrival: "06:08 pm", departure: "06:10 pm" },
  { name: "Aluthgama", arrival: "06:29 pm", departure: "06:35 pm" },
  { name: "Bentota", arrival: "06:37 pm", departure: "06:38 pm" },
  { name: "Ambalangoda", arrival: "07:00 pm", departure: "07:03 pm" },
  { name: "Hikkaduwa", arrival: "07:13 pm", departure: "07:15 pm" },
  { name: "Galle", arrival: "07:34 pm", departure: "07:50 pm" },
  { name: "Katugoda", arrival: "07:56 pm", departure: "07:57 pm" },
  { name: "Unawatuna", arrival: "07:59 pm", departure: "08:00 pm" },
  { name: "Thalpe", arrival: "08:06 pm", departure: "08:12 pm" },
  { name: "Habaraduwa", arrival: "08:15 pm", departure: "08:16 pm" },
  { name: "Koggala", arrival: "08:18 pm", departure: "08:19 pm" },
  { name: "Kathaluwa", arrival: "08:21 pm", departure: "08:22 pm" },
  { name: "Ahangama", arrival: "08:25 pm", departure: "08:26 pm" },
  { name: "Midigama", arrival: "08:30 pm", departure: "08:31 pm" },
  { name: "Kumbalgama", arrival: "08:33 pm", departure: "08:34 pm" },
  { name: "Weligama", arrival: "08:37 pm", departure: "08:38 pm" },
  { name: "Polwathumodara", arrival: "08:42 pm", departure: "08:43 pm" },
  { name: "Mirissa", arrival: "08:45 pm", departure: "08:46 pm" },
  { name: "Kamburugamuwa", arrival: "08:49 pm", departure: "08:50 pm" },
  { name: "Walgama", arrival: "08:54 pm", departure: "08:55 pm" },
  { name: "Matara", arrival: "08:58 pm", departure: "09:00 pm" },
  { name: "Piladuwa", arrival: "09:02 pm", departure: "09:03 pm" },
  { name: "Weherahena", arrival: "09:06 pm", departure: "09:07 pm" },
  { name: "Kakanadura", arrival: "09:10 pm", departure: "09:11 pm" },
  { name: "Bambaranda", arrival: "09:18 pm", departure: "09:19 pm" },
  { name: "Wewurukannala", arrival: "09:25 pm", departure: "09:26 pm" },
  { name: "Beliaththa", arrival: "09:36 pm", departure: "09:36 pm" },
];


const seedStops = async () => {
  const train = await Train.findOne({ name: "Galu Kumari" });
  const relevantSchedules = await Schedule.find({ trainRef: train._id })
  const schedule = relevantSchedules[1];
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
