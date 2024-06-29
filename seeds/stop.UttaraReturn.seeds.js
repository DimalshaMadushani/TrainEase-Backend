
import Stop from "../models/stop.model.js";
import Station from "../models/station.model.js";
import Schedule from "../models/schedule.model.js";
import Train from "../models/train.model.js";

const stationsData = [
  { name: "Kankesanthurai", arrival: "05:30 am", departure: "05:30 am" },
  { name: "Tellippalai", arrival: "05:34 am", departure: "05:35 am" },
  { name: "Chunnakam", arrival: "05:39 am", departure: "05:40 am" },
  { name: "Kondavil", arrival: "05:45 am", departure: "05:46 am" },
  { name: "Kokuvil", arrival: "05:48 am", departure: "05:49 am" },
  { name: "Jaffna", arrival: "06:01 am", departure: "06:02 am" },
  { name: "Navatkuli", arrival: "06:16 am", departure: "06:17 am" },
  { name: "Chavakachcheri", arrival: "06:24 am", departure: "06:25 am" },
  { name: "Kodikamam", arrival: "06:31 am", departure: "06:32 am" },
  { name: "Pallai", arrival: "06:44 am", departure: "06:45 am" },
  { name: "Kilinochchi", arrival: "07:06 am", departure: "07:07 am" },
  { name: "Mankulam", arrival: "07:33 am", departure: "07:34 am" },
  { name: "Vavuniya", arrival: "08:07 am", departure: "08:08 am" },
  { name: "Medawachchi", arrival: "08:27 am", departure: "08:28 am" },
  { name: "Anuradhapura", arrival: "08:52 am", departure: "08:55 am" },
  { name: "Galgamuwa", arrival: "10:01 am", departure: "10:03 am" },
  { name: "Maho", arrival: "10:34 am", departure: "10:39 am" },
  { name: "Kurunegala", arrival: "11:14 am", departure: "11:15 am" },
  { name: "Polgahawela", arrival: "11:40 am", departure: "11:42 am" },
  { name: "Gampaha", arrival: "12:22 pm", departure: "12:23 pm" },
  { name: "Maradana", arrival: "12:51 pm", departure: "12:53 pm" },
  { name: "Colombo Fort", arrival: "12:56 pm", departure: "12:56 pm" },
];

const seedUttaraReturn = async () => {
  try{
  const train = await Train.findOne({ name: "Uttara Devi" }); // Replace with your train name
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
  console.log("Uttara devi return stops Seeding complete!");
  } catch (error) {
    console.log("Error in seeding stops Uttara Return: ", error);
}
};

export default seedUttaraReturn;
