
import Stop from "../models/stop.model.js";
import Station from "../models/station.model.js";
import Schedule from "../models/schedule.model.js";
import Train from "../models/train.model.js";

const stationsData = [
  { name: "Beliaththa", arrival: "05:25 am", departure: "05:25 am" },
  { name: "Wewurukannala", arrival: "05:36 am", departure: "05:37 am" },
  { name: "Bambaranda", arrival: "05:41 am", departure: "05:42 am" },
  { name: "Kakanadura", arrival: "05:48 am", departure: "05:49 am" },
  { name: "Weherahena", arrival: "05:52 am", departure: "05:53 am" },
  { name: "Matara", arrival: "06:00 am", departure: "06:12 am" },
  { name: "Walgama", arrival: "06:16 am", departure: "06:17 am" },
  { name: "Kamburugamuwa", arrival: "06:20 am", departure: "06:21 am" },
  { name: "Mirissa", arrival: "06:25 am", departure: "06:26 am" },
  { name: "Polwathumodara", arrival: "06:29 am", departure: "06:30 am" },
  { name: "Weligama", arrival: "06:34 am", departure: "06:35 am" },
  { name: "Kumbalgama", arrival: "06:39 am", departure: "06:40 am" },
  { name: "Midigama", arrival: "06:42 am", departure: "06:43 am" },
  { name: "Ahangama", arrival: "06:47 am", departure: "06:48 am" },
  { name: "Kathaluwa", arrival: "06:52 am", departure: "06:53 am" },
  { name: "Koggala", arrival: "06:56 am", departure: "06:57 am" },
  { name: "Habaraduwa", arrival: "06:59 am", departure: "07:00 am" },
  { name: "Thalpe", arrival: "07:03 am", departure: "07:04 am" },
  { name: "Unawatuna", arrival: "07:09 am", departure: "07:10 am" },
  { name: "Katugoda", arrival: "07:12 am", departure: "07:13 am" },
  { name: "Galle", arrival: "07:19 am", departure: "07:27 am" },
  { name: "Hikkaduwa", arrival: "07:44 am", departure: "07:45 am" },
  { name: "Ambalangoda", arrival: "07:56 am", departure: "07:57 am" },
  { name: "Ahungalle", arrival: "08:06 am", departure: "08:07 am" },
  { name: "Bentota", arrival: "08:19 am", departure: "08:20 am" },
  { name: "Aluthgama", arrival: "08:23 am", departure: "08:24 am" },
  { name: "Kalutara South", arrival: "08:43 am", departure: "08:45 am" },
  { name: "Panadura", arrival: "09:01 am", departure: "09:03 am" },
  { name: "Moratuwa", arrival: "09:12 am", departure: "09:13 am" },
  { name: "Mount Lavinia", arrival: "09:22 am", departure: "09:23 am" },
  { name: "Colombo Fort", arrival: "09:40 am", departure: "09:42 am" },
  { name: "Maradana", arrival: "09:47 am", departure: "09:47 am" },
];

const seedGaluKumari = async () => {
  try{
  const train = await Train.findOne({ name: "Galu Kumari" });
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
  console.log("Galu kumari Stops successfully populated");
}catch(error){
  console.error("Error populating stops:", error);
};
}
export default seedGaluKumari;
