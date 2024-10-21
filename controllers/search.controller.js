import Schedule from "../models/schedule.model.js";
import Stop from "../models/stop.model.js";
import Booking from "../models/booking.model.js";
import Station from "../models/station.model.js";
import CoachType from "../models/coachType.model.js";
import ExpressError from "../utils/ExpressError.js";
import Train from "../models/train.model.js";
import Coach from "../models/coach.model.js";
import Seat from "../models/seat.model.js";



//this controller is used to get all the station, this need to fetch all the station  in the search bar when need.
export const getStations = async (req, res, next) => {
    const stations = await Station.find().sort("name");
    res.status(200).json(stations);
  };
  
  export const getStationName = async (req, res, next) => {
    const station = await Station.findById(req.params.id);
    res.status(200).json(station);
  };
  
  export const getSchedules = async (req, res, next) => {
    // get the fromName, toName and date that user has entered in the search bar
    const { fromName, toName, date } = req.query;
  
    // Find the station with the given fromName
    const fromStation = await Station.findOne({ name: fromName });
    // Find the station with the given toName
    const toStation = await Station.findOne({ name: toName });
  
    // If the fromStation or toStation is not found, throw an error
    if (!fromStation || !toStation) {
      throw new ExpressError("Invalid Station Name", 400);
    }
  
    // Create a Date object
    const dateObj = new Date(date);
  
    // Get the day of the week as a number (0-6)
    const dayOfWeekNumber = dateObj.getDay();
  
    // Array of day names
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
  
    // Get the day name
    const dayName = daysOfWeek[dayOfWeekNumber];
    // console.log(dayName);
    // Find all schedules that run on the given date
    // populate only the name field of the trainRef field
    const dateSchedules = await Schedule.find({ [dayName]: true })
      .populate("trainRef", "name")
      .select("-monday -tuesday -wednesday -thursday -friday -saturday -sunday"); // Select all fields except the days of the week
  
    const finalSchedules = [];
    // from all the schedules, filter out the schedules that have the fromStation before the toStation
    for (let schedule of dateSchedules) {
      // from all schedules filter the schedules that have both fromStation and toStation as stops
      const fromStop = await Stop.findOne({
        stationRef: fromStation._id,
        scheduleRef: schedule._id,
      });
      const toStop = await Stop.findOne({
        stationRef: toStation._id,
        scheduleRef: schedule._id,
      });
  
      // if the fromStop is before the toStop, add the schedule to the finalSchedules array
      if (fromStop && toStop && fromStop.stopNumber < toStop.stopNumber) {
        finalSchedules.push({ schedule, fromStop, toStop });
      }
    }
    return res.status(200).json(finalSchedules); // Send the finalSchedules array as the response
  };
  
  export const getTrainDetails = async (req, res, next) => {
    const { scheduleId, fromStopId, toStopId } = req.query;
    console.log("getTrain details",scheduleId, fromStopId, toStopId);
  
    const fromStop = await Stop.findById(fromStopId).populate("stationRef"); // Find the fromStop and populate the stationRef field
    const toStop = await Stop.findById(toStopId).populate("stationRef"); // Find the toStop and populate the stationRef field
  
    const schedule = await Schedule.findById(scheduleId).populate({
      path: "trainRef", //populate the trainRef field of the schedule
      populate: {
        //populate the coaches field of the trainRef
        path: "coaches",
        select: "coachTypeRef",
        populate: {
          //populate the coachTypeRef field of the coaches
          path: "coachTypeRef",
          select: "name",
        },
      },
    });
    const trainDetails = schedule.trainRef;
  
    // get the coach types using the name
    const firstClass = await CoachType.findOne({ name: "First Class" }).lean();
    const secondClass = await CoachType.findOne({ name: "Second Class" }).lean();
    const thirdClass = await CoachType.findOne({ name: "Third Class" }).lean();
  
    // set the availability of the classes to false, since we use lean to get plain JavaScript objects, we can modify the objects
    firstClass.available = false;
    secondClass.available = false;
    thirdClass.available = false;
  
    for (let coach of trainDetails.coaches) {
      if (coach.coachTypeRef.name === "First Class") {
        firstClass.available = true;
      } else if (coach.coachTypeRef.name === "Second Class") {
        secondClass.available = true;
      } else {
        thirdClass.available = true;
      }
    }
  
    return res.status(200).json({
      fromStation: fromStop.stationRef.name,
      toStation: toStop.stationRef.name,
      coachTypes: [firstClass, secondClass, thirdClass], // Send the coach types as an array with each having availability
    });
    // return res.status(200).json(trainDetails);
  };
  
  // Controller function for getting train details
  // export const getTrainDetails = async (req, res) => {
  //   const { scheduleId, trainId, fromStop, toStop } = req.body;
  
  //   // Validate the required data
  //   if (!scheduleId || !trainId || !fromStop || !toStop) {
  //       return res.status(400).json({ message: "Missing required fields: scheduleId, trainId, fromStop, or toStop" });
  //   }
  
  //   try {
  //       // Fetch station names using IDs provided in fromStop and toStop
  //       const fromStationName = await Station.findById(fromStop.stationRef).select('name');
  //       const toStationName = await Station.findById(toStop.stationRef).select('name');
  
  //       if (!fromStationName || !toStationName) {
  //           return res.status(404).json({ message: "One or more stations not found" });
  //       }
  
  //       // Fetch train details and populate the related coach types
  //       const trainDetails = await Train.findById(trainId).populate({
  //           path: "coaches",
  //           select: "coachTypeRef",
  //           populate: {
  //               path: "coachTypeRef",
  //               select: "name",
  //           },
  //       });
  
  //       if (!trainDetails) {
  //           return res.status(404).json({ message: "Train not found" });
  //       }
  
  //       // Determine class availability
  //       const classAvailability = {
  //           firstClassAvailable: false,
  //           secondClassAvailable: false,
  //           thirdClassAvailable: false
  //       };
  
  //       trainDetails.coaches.forEach(coach => {
  //           if (coach.coachTypeRef.name === "First Class") {
  //               classAvailability.firstClassAvailable = true;
  //           } else if (coach.coachTypeRef.name === "Second Class") {
  //               classAvailability.secondClassAvailable = true;
  //           } else if (coach.coachTypeRef.name === "Third Class") {
  //               classAvailability.thirdClassAvailable = true;
  //           }
  //       });
  
  //       // Calculate journey price
  //       const journeyPrice = toStop.price - fromStop.price;
  
  //       // Fetch price factors if needed
  //       const priceFactors = await CoachType.find(); // Assuming you need this for some reason
  
  //       // Construct and send response
  //       res.status(200).json({
  //           scheduleId,
  //           train: {
  //               id: trainDetails._id,
  //               name: trainDetails.name,
  //               ...classAvailability,
  //           },
  //           fromStation: {
  //               id: fromStationName._id,
  //               name: fromStationName.name,
  //               departureTime: fromStop.departureTime,
  //               platform: fromStop.platform,
  //               stopNumber: fromStop.stopNumber,
  //           },
  //           toStation: {
  //               id: toStationName._id,
  //               name: toStationName.name,
  //               arrivalTime: toStop.arrivalTime,
  //           },
  //           journeyPrice,
  //           priceFactors,
  //       });
  //   } catch (error) {
  //       console.error('Failed to fetch train details:', error);
  //       res.status(500).json({ message: 'Internal server error', error: error.message });
  //   }
  // };
  // get the details of the coaches of the requested class of the train
  export const getCoachDetails = async (req, res, next) => {
    const { date, fromStopId, toStopId, scheduleId, selectedClassId } = req.query;
  
    // get the train with the given trainId
    // populate the coaches field and the coachTypeRef field of each coach
  
    const schedule = await Schedule.findById(scheduleId)
      .populate({
        path: "trainRef",
        populate: {
          path: "coaches",
          populate: {
            path: "seats coachTypeRef",
            select: "-facilities",
          },
        },
      })
      .lean(); // use lean() to get plain JavaScript objects so that we can modify the objects by adding new fields
    const train = schedule.trainRef;
  
    const selectedClass = await CoachType.findById(selectedClassId).select(
      "name"
    ); // get the selected class using the selectedClassId
  
    // from all the coaches in the train, filter out the coaches that have the selected class
    const requestedClassCoaches = [];
    train.coaches.forEach((coach) => {
      if (coach.coachTypeRef.name === selectedClass.name) {
        requestedClassCoaches.push(coach);
      }
    });
  
    // get all the bookings of that schedule on that date
    const AllbookingsOnDate = await Booking.find({
      scheduleRef: schedule._id,
      date: {
        $gte: new Date(date),
        $lt: new Date(date).setDate(new Date(date).getDate() + 1),
      },
      status: { $ne: "cancelled" }, // exclude the cancelled bookings. that means only confirmed and hold bookings are considered
    }).populate("from to seats"); // populate the from, to and seats fields of the booking
  
    // get the from stop and to stop using the fromStopId and toStopId
    const fromStop = await Stop.findById(fromStopId);
    const toStop = await Stop.findById(toStopId);
  
    // filter out the bookings that have a to stop number greater than the from stop number.
    // that is, the bookings that are relevant to the journey from the from stop to the to stop
    let relevantBookingsOnDate = [];
    AllbookingsOnDate.forEach((booking) => {
      if (
        !(
          (fromStop.stopNumber < booking.from.stopNumber &&
            toStop.stopNumber <= booking.from.stopNumber) ||
          (fromStop.stopNumber >= booking.to.stopNumber &&
            toStop.stopNumber > booking.to.stopNumber)
        )
      ) {
        relevantBookingsOnDate.push(booking);
      }
    });
    // from all the relevant bookings, get all the booked seats
    const relevantBookedSeats = relevantBookingsOnDate
      .map((booking) => booking.seats)
      .flat();
  
    // for each coach, filter out the booked seats that belong to that coach
    for (let i = 0; i < requestedClassCoaches.length; i++) {
      const allSeatsofCurrCoach = requestedClassCoaches[i].seats.map((seat) =>
        seat._id.toString()
      );
      const bookedSeatsofCurrCoach = relevantBookedSeats.filter((seat) =>
        allSeatsofCurrCoach.includes(seat._id.toString())
      );
      // add the booked seats to the coach object , we can use this since we used lean() to get plain JavaScript objects
      //by this al
      requestedClassCoaches[i].alreadyBookedSeats = bookedSeatsofCurrCoach.map(
        (seat) => seat._id
      );
    }
  
    res.status(200).json({ requestedClassCoaches });
  };