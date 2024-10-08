
import Train from '../models/train.model.js';
import Schedule from '../models/schedule.model.js';


// Function to create schedule data
const createSchedules = async () => {
  try {
    // Get the train data
    const trains = await Train.find({});

    // Check if schedules already exist
    const existingSchedules = await Schedule.find({});
    if (existingSchedules.length > 0) {
      console.log('Schedules already populated');
      return;
    }

    // Create schedule instances
    const schedules = [];
   const scheduleDays = [
    {
        "monday": true,
        "tuesday": true,
        "wednesday": true,
        "thursday": true,
        "friday": true,
        "saturday": true,
        "sunday": false
    },
    {
        "monday": true,
        "tuesday": true,
        "wednesday": true,
        "thursday": true,
        "friday": true,
        "saturday": true,
        "sunday": true
    },
    {
        "monday": true,
        "tuesday": true,
        "wednesday": true,
        "thursday": true,
        "friday": true,
        "saturday": false,
        "sunday": false
    }
   ]

    trains.forEach(train => {
        const randomSchedule = scheduleDays[Math.floor(Math.random() * scheduleDays.length)];
      for (let i = 0; i < 2; i++) {
        // Create a random schedule for the train
        const schedule = {
          trainRef: train._id,
            ...randomSchedule,
          isReturn: i === 1 ? true : false,  
        };

        schedules.push(schedule);
      }
    });

    // Insert schedule data into the database
    await Schedule.insertMany(schedules);

    console.log('Schedules successfully populated');
  } catch (error) {
    console.error('Error populating schedules:', error);
  } 
};

export default createSchedules;