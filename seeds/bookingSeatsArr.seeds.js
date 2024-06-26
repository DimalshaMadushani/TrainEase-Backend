import mongoose from 'mongoose';
import Booking from '../models/booking.model.js';
import BookedSeat from '../models/bookedSeat.model.js';

const dbUrl = "mongodb://127.0.0.1:27017/train-booking-test";

// Connect to MongoDB
mongoose.connect(dbUrl)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB', err);
});

const addBookedSeatstoArr = async () => {
    try {
        const bookedSeats = await BookedSeat.find({});
        for (let seat of bookedSeats) {
            const booking = await Booking.findById(seat.bookingRef);
            booking.seats.push(seat.seatRef);
            await booking.save();
        }
        console.log('BookedSeats added to booking successfully');
    } catch (error) {
        console.error('Error adding bookedSeats to booking:', error);
    } finally {
        mongoose.connection.close();
    }
}

addBookedSeatstoArr();
