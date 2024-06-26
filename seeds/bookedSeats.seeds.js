import mongoose from 'mongoose';
import Booking from '../models/booking.model.js';
import Schedule from '../models/schedule.model.js';
import Train from '../models/train.model.js';
import BookedSeat from '../models/bookedSeat.model.js';
import Coach from '../models/coach.model.js';

const dbUrl = "mongodb://127.0.0.1:27017/train-booking-test";

// Connect to MongoDB
mongoose.connect(dbUrl)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Function to create bookedSeats data
const createBookedSeats = async () => {
  try {
    // Get the booking data
    const bookings = await Booking.find({});

    // Check if bookedSeats already exist
    const existingBookedSeats = await BookedSeat.find({});
    if (existingBookedSeats.length > 0) {
      console.log('BookedSeats already populated');
      return;
    }

    for (let booking of bookings) {
      const schedule = await Schedule.findById(booking.scheduleRef);
      const train = await Train.findById(schedule.trainRef);
      const coaches = train.coaches;
      const randomCoachId = coaches[Math.floor(Math.random() * coaches.length)];
        const randomCoach = await Coach.findById(randomCoachId);
      const seatsofCoach = randomCoach.seats;
      for (let i = 0; i < 3; i++) {
        const randomSeatId = seatsofCoach[Math.floor(Math.random() * seatsofCoach.length)];
        await BookedSeat.create({
          bookingRef: booking._id,
          seatRef: randomSeatId,
          amount: Math.floor(Math.random() * (1000 - 20 + 1)) + 20
        });
      }
    }

    console.log('BookedSeats successfully populated');
  } catch (error) {
    console.error('Error populating bookedSeats:', error);
  } finally {
    mongoose.connection.close();
  }
};

createBookedSeats();