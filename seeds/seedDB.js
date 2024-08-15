import mongoose from "mongoose";
import createCoachTypes from "./coachType.seeds.js";
import createSeats from "./seat.seeds.js";
import createCoaches from "./coach.seeds.js";
import createTrains from "./train.seeds.js";
import createStations from "./station.seeds.js";
import createSchedules from "./schedule.seeds.js";
import seedGaluKumari from "./stop.Galu.seeds.js";
import seedGaluKumariReturn from "./stop.GaluReturn.seeds.js";
import seedRajarataRajina from "./stop.Rajarata.seeds.js";
import seedRajarataRajinaReturn from "./stop.RajarataReturn.seeds.js";
import seedUttaraStops from "./stop.Uttara.seeds.js";
import seedUttaraReturn from "./stop.UttaraReturn.seeds.js";
import createUser from "./user.seeds.js";
import createBookings from "./booking.seeds.js";
import seedSeatsWithCoach from "./seedSeatsWithCoach.js";

const dbUrl = "mongodb://127.0.0.1:27017/TrainEaseDB";

// Connect to MongoDB
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

  const seedTheDB = async () => {
    try {
      await createCoachTypes();
        await createSeats();
        await createCoaches();
        await createTrains();
        await createStations();
        await createSchedules();
        await seedGaluKumari();
        await seedGaluKumariReturn();
        await seedRajarataRajina();
        await seedRajarataRajinaReturn();
        await seedUttaraStops();
        await seedUttaraReturn();
        await createUser();
        await createBookings();
        await seedSeatsWithCoach();
      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      mongoose.connection.close();
    }
  }

    seedTheDB();