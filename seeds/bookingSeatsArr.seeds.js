
import Booking from '../models/booking.model.js';
import BookedSeat from '../models/bookedSeat.model.js';



const populateBookedSeatsToArray = async () => {
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
    }
}

export default populateBookedSeatsToArray;