
import Seat from "../models/seat.model.js";

const firstSecondSeats = [
  { id: "1A", x: 20, y: 20 },
  { id: "1B", x: 90, y: 20 },
  { id: "1C", x: 250, y: 20 },
  { id: "1D", x: 320, y: 20 },

  { id: "2A", x: 20, y: 90 },
  { id: "2B", x: 90, y: 90 },
  { id: "2C", x: 250, y: 90 },
  { id: "2D", x: 320, y: 90 },

  { id: "3A", x: 20, y: 160 },
  { id: "3B", x: 90, y: 160 },
  { id: "3C", x: 250, y: 160 },
  { id: "3D", x: 320, y: 160 },

  { id: "4A", x: 20, y: 230 },
  { id: "4B", x: 90, y: 230 },
  { id: "4C", x: 250, y: 230 },
  { id: "4D", x: 320, y: 230 },

  { id: "5A", x: 20, y: 300 },
  { id: "5B", x: 90, y: 300 },
  { id: "5C", x: 250, y: 300 },
  { id: "5D", x: 320, y: 300 },

  { id: "6A", x: 20, y: 370 },
  { id: "6B", x: 90, y: 370 },
  { id: "6C", x: 250, y: 370 },
  { id: "6D", x: 320, y: 370 },
];

const thirdSeats = [
  { id: "1A", x: 20, y: 20 },
  { id: "1B", x: 80, y: 20 },
  { id: "1C", x: 140, y: 20 },
  { id: "1D", x: 260, y: 20 },
  { id: "1E", x: 320, y: 20 },

  { id: "2A", x: 20, y: 84 },
  { id: "2B", x: 80, y: 84 },
  { id: "2C", x: 140, y: 84 },
  { id: "2D", x: 260, y: 84 },
  { id: "2E", x: 320, y: 84 },


  { id: "3A", x: 20, y: 163 },
  { id: "3B", x: 80, y: 163 },
  { id: "3C", x: 140, y: 163 },
  { id: "3D", x: 260, y: 163 },
  { id: "3E", x: 320, y: 163 },

  { id: "4A", x: 20, y: 227 },
  { id: "4B", x: 80, y: 227 },
  { id: "4C", x: 140, y: 227 },
  { id: "4D", x: 260, y: 227 },
  { id: "4E", x: 320, y: 227 },


  { id: "5A", x: 20, y: 306 },
  { id: "5B", x: 80, y: 306 },
  { id: "5C", x: 140, y: 306 },
  { id: "5D", x: 260, y: 306 },
  { id: "5E", x: 320, y: 306 },

  { id: "6A", x: 20, y: 370 },
  { id: "6B", x: 80, y: 370 },
  { id: "6C", x: 140, y: 370 },
  { id: "6D", x: 260, y: 370 },
  { id: "6E", x: 320, y: 370 },
];



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
  } 
};

export default createSeats;
