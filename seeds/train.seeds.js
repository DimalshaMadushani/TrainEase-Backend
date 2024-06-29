
import Train from '../models/train.model.js';
import Coach from '../models/coach.model.js';


// List of Sri Lanka trains
const trainNames = [
  'Galu Kumari', // Beliatte - Maradana and return (not Sunday)
  'Rajarata Rajina', // Beliatte - Madawachchiya and return
  'Uttara Devi', // Colombo - Kankasanture and return
  // 'Samudra Devi', // Beliatte - Maradana and return 
  // 'Sagarika', // Beliatte - Maradana and return
  // 'Udarata Menike', // Colombo - Kandy and return
  // 'Ruhunu Kumari', // Beliatte - Maradana and return 
  // 'Yal Devi', // Mount Lavinia - Kankasanture and return
  // 'Sri Devi', // Kankasanture - Kotte and return 
  // 'Nuwara Train', // Beliatte - Kandy and return
];

// Function to create train data
const createTrains = async () => {
  try {
    // Check if trains already exist
    const existingTrains = await Train.find({});
    if (existingTrains.length > 0) {
      console.log('Trains already populated');
      return;
    }

    const coaches = await Coach.find({});
    await Train.insertMany([
      { name: 'Galu Kumari', coaches: coaches.slice(0, 5).map(coach => coach._id) }, 
      { name: 'Rajarata Rajina', coaches: coaches.slice(5, 8).map(coach => coach._id) },
      { name: 'Uttara Devi', coaches: coaches.slice(8, 10).map(coach => coach._id) },
    ]);
    console.log('Trains successfully populated');
  } catch (error) {
    console.error('Error populating trains:', error);
  } 
};

export default createTrains;
