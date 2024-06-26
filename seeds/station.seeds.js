import mongoose from "mongoose";
import Station from "../models/station.model.js";

const dbUrl = "mongodb://127.0.0.1:27017/train-booking-test";

// Connect to MongoDB
mongoose.connect(dbUrl)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// List of Sri Lanka station names
const stationNames = [
    "Beliaththa",
    "Wewurukannala",
    "Bambaranda",
    "Kakanadura",
    "Weherahena",
    "Matara",
    "Walgama",
    "Kamburugamuwa",
    "Mirissa",
    "Polwathumodara",
    "Weligama",
    "Kumbalgama",
    "Midigama",
    "Ahangama",
    "Kathaluwa",
    "Koggala",
    "Habaraduwa",
    "Thalpe",
    "Unawatuna",
    "Katugoda",
    "Galle",
    "Hikkaduwa",
    "Ambalangoda",
    "Ahungalle",
    "Bentota",
    "Aluthgama",
    "Kalutara South",
    "Panadura",
    "Moratuwa",
    "Mount Lavinia",
    "Colombo Fort",
    "Maradana",
    "Anuradhapura",
    "Polgahawela",
    "Alawwa",
    "Meerigama",
    "Veyangoda",
    "Gampaha",
    "Ragama",
    "Kurunegala",
    "Maho",
    "Galgamuwa",
    "Thambuttegama",
    "Vavuniya",
    "Mankulam",
    "Ariyiya Nagar",
    "Kilinochchi",
    "Pallai",
    "Kodikamam",
    "Chavakachcheri",
    "Jaffna",
    "Kokuvil",
    "Kondavil",
    "Chunnakam",
    "Mallakam",
    "Tellippallai",
    "Kankesanthurai",
    "Dehiwala",
    "Ratmalana",
    "Wadduwa",
    "Kalutara North",
    "Piladuwa",
    "Ariviya Nagar",
    "Tellippalai",
    "Medawachchi",
    "Navatkuli"
];


// Function to create station data
const createStations = async () => {
  try {
    // Check if stations already exist
    const existingStations = await Station.find({});
    if (existingStations.length > 0) {
      console.log("Stations already populated");
      return;
    }

    // Create station instances
    const stations = stationNames.map((name) => ({
        name,
        }));

    // Insert station data into the database
    await Station.insertMany(stations);

    console.log("Stations successfully populated");
  } catch (error) {
    console.error("Error populating stations:", error);
  } finally {
    mongoose.connection.close();
  }
};

createStations();
