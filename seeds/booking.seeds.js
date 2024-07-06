
import Schedule from '../models/schedule.model.js';
import User from '../models/user.model.js';
import Stop from '../models/stop.model.js';
import Booking from '../models/booking.model.js';
import Train from '../models/train.model.js';



// Function to create booking data
const createBookings = async () => {
  try {
    // Get the user data
    const users = await User.find({});
    const schedules = await Schedule.find({});

    for (let i = 0; i < 10; i++) {
        // Randomly select a user
        const user = users[Math.floor(Math.random() * users.length)];
    
        // Randomly select a schedule
        const schedule = schedules[Math.floor(Math.random() * schedules.length)];
        const trainOnSchedule = await Train.findOne({ _id: schedule.trainRef }).populate('coaches');
        const getRandomCoach = trainOnSchedule.coaches[Math.floor(Math.random() * trainOnSchedule.coaches.length)];
    
        // Get all stops for the schedule
        const stops = await Stop.find({ scheduleRef: schedule._id });

        // Randomly select a start stop
        const stop1 = stops[Math.floor(Math.random() * stops.length)];

        // Randomly select an end stop
        const stop2 = stops[Math.floor(Math.random() * stops.length)];

        let startStop;
        let endStop;

        if (stop1.stopNumber < stop2.stopNumber) {
            startStop = stop1;
            endStop = stop2;
        } else {
            startStop = stop2;
            endStop = stop1;
        }

        const getRandomSeats = () => {
          const randomSeatCount = Math.floor(Math.random() * 5) + 1;
          const seats = []
          for (let i = 0; i < randomSeatCount; i++) {
            const randomSeat = getRandomCoach.seats[Math.floor(Math.random() * getRandomCoach.seats.length)];
            if (!seats.includes(randomSeat)) {
              seats.push(randomSeat);
            }
          }
          return seats;
        }

        // Create booking instances
        await Booking.create({
            userRef: user._id,
            scheduleRef: schedule._id,
            date: new Date(),
            from: startStop._id,
            to: endStop._id,
            totalAmount: Math.abs(startStop.price - endStop.price),
            status: 'confirmed',
            seats: getRandomSeats(),
        });
    }
    console.log('Bookings successfully seeded');
    }
   catch (error) {
    console.error('Error populating bookings:', error);
  } 
};

export default createBookings;