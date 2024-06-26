import mongoose from "mongoose";
import Seat from "../models/seat.model.js";

const firstSecondSeats = [
  { id: "1A", x: 20, y: 20 },
  { id: "1B", x: 60, y: 20 },
  { id: "1C", x: 140, y: 20 },
  { id: "1D", x: 180, y: 20 },
  { id: "2A", x: 20, y: 60 },
  { id: "2B", x: 60, y: 60 },
  { id: "2C", x: 140, y: 60 },
  { id: "2D", x: 180, y: 60 },
  { id: "3A", x: 20, y: 100 },
  { id: "3B", x: 60, y: 100 },
  { id: "3C", x: 140, y: 100 },
  { id: "3D", x: 180, y: 100 },
  { id: "4A", x: 20, y: 140 },
  { id: "4B", x: 60, y: 140 },
  { id: "4C", x: 140, y: 140 },
  { id: "4D", x: 180, y: 140 },
  { id: "5A", x: 20, y: 180 },
  { id: "5B", x: 60, y: 180 },
  { id: "5C", x: 140, y: 180 },
  { id: "5D", x: 180, y: 180 },
];

const thirdSeats = [
  { id: "1A", x: 20, y: 20 },
  { id: "1B", x: 60, y: 20 },
  { id: "1C", x: 100, y: 20 },
  { id: "1D", x: 180, y: 20 },
  { id: "1E", x: 220, y: 20 },

  { id: "2A", x: 20, y: 60 },
  { id: "2B", x: 60, y: 60 },
  { id: "2C", x: 100, y: 60 },
  { id: "2D", x: 180, y: 60 },
  { id: "2E", x: 220, y: 60 },

  { id: "3A", x: 20, y: 120 },
  { id: "3B", x: 60, y: 120 },
  { id: "3C", x: 100, y: 120 },
  { id: "3D", x: 180, y: 120 },
  { id: "3E", x: 220, y: 120 },

  { id: "4A", x: 20, y: 160 },
  { id: "4B", x: 60, y: 160 },
  { id: "4C", x: 100, y: 160 },
  { id: "4D", x: 180, y: 160 },
  { id: "4E", x: 220, y: 160 },
];

const dbUrl = "mongodb://127.0.0.1:27017/train-booking-test";

// Connect to MongoDB
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const createSeats = async () => {
  try {
    await Seat.insertMany([ 
      ...firstSecondSeats.map((seat) => ({ name: seat.id, position: [seat.x, seat.y]})), // first class of Galu Kumari
      ...firstSecondSeats.map((seat) => ({ name: seat.id, position: [seat.x, seat.y]})), // second class of Galu Kumari
      ...firstSecondSeats.map((seat) => ({ name: seat.id, position: [seat.x, seat.y]})), // second class of Galu Kumari
      ...thirdSeats.map((seat) => ({ name: seat.id, position: [seat.x, seat.y]})), // third class of Galu Kumari
      ...thirdSeats.map((seat) => ({ name: seat.id, position: [seat.x, seat.y]})), // third class of Galu Kumari

      ...firstSecondSeats.map((seat) => ({ name: seat.id, position: [seat.x, seat.y]})), // first class of Rajarata Rajina
      ...firstSecondSeats.map((seat) => ({ name: seat.id, position: [seat.x, seat.y]})), // second class of Rajarata Rajina
      ...firstSecondSeats.map((seat) => ({ name: seat.id, position: [seat.x, seat.y]})), // second class of Rajarata Rajina

      ...firstSecondSeats.map((seat) => ({ name: seat.id, position: [seat.x, seat.y]})), // second class of Uttara Devi
      ...thirdSeats.map((seat) => ({ name: seat.id, position: [seat.x, seat.y]})), // third class of Uttara Devi
    ]
    );

    console.log("Seats successfully populated");
  } catch (error) {
    console.error("Error populating seats:", error);
  } finally {
    mongoose.connection.close();
  }
};

createSeats();
