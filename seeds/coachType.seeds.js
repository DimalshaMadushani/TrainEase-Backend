
// import coachType from "../models/coachType.model.js";



// const coachTypes = [
//   { name: "First Class", priceFactor: 4 },
//   { name: "Second Class", priceFactor: 2 },
//   { name: "Third Class", priceFactor: 1 },
// ];

// const createCoachTypes = async () => {
//   try {
//     // Check if coachTypes already exist
//     const existingCoachTypes = await coachType.find({});
//     if (existingCoachTypes.length > 0) {
//       console.log("CoachTypes already populated");
//       return;
//     }
//     // Create coachType instances
//     await coachType.insertMany(coachTypes);
//     console.log("CoachTypes successfully populated");
//   } catch (error) {
//     console.error("Error populating coachTypes:", error);
//   } 
// };

// export default createCoachTypes;


import CoachType from "../models/coachType.model.js";

const coachTypes = [
  {
    name: "First Class",
    priceFactor: 4,
    facilities: [
      "Air-conditioned",
      "Reclining seats",
      "Complimentary meals",
      
    ]
  },
  {
    name: "Second Class",
    priceFactor: 2,
    facilities: [
      "Air-conditioned",
      "Reclining seats",
      "Onboard snacks",
      
    ]
  },
  {
    name: "Third Class",
    priceFactor: 1,
    facilities: [
      "Basic seating",
      "No air-conditioning",
      "Affordable travel"
    ]
  },
];

const createCoachTypes = async () => {
  try {
    // Check if coachTypes already exist
    const existingCoachTypes = await CoachType.find({});
    if (existingCoachTypes.length > 0) {
      console.log("CoachTypes already populated");
      return;
    }
    // Create coachType instances
    await CoachType.insertMany(coachTypes);
    console.log("CoachTypes successfully populated");
  } catch (error) {
    console.error("Error populating coachTypes:", error);
  } 
};

export default createCoachTypes;
