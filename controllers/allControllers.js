import Schedule from "../models/schedule.model.js";
import Stop from "../models/stop.model.js";
import Train from "../models/train.model.js";
import BookedSeat from "../models/BookedSeat.model.js";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import Station from "../models/station.model.js";
import Coach from "../models/coach.model.js";
import CoachType from "../models/coachType.model.js";
import Seat from "../models/seat.model.js";
import ExpressError from "../utils/ExpressError.js";
import mongoose from "mongoose";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { populate } from "dotenv";
// import nodemailer from "nodemailer";
// import { PDFDocument, rgb } from "pdf-lib";

//this controller is used to get all the station, this need to fetch all the station  in the search bar when need.
export const getStations = async (req, res, next) => {
  const stations = await Station.find().sort("name");
  res.status(200).json(stations);
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
          toStop.stopNumber < booking.from.stopNumber) ||
        (fromStop.stopNumber > booking.to.stopNumber &&
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

// hold the selected seats for the user until the holdExpiry time
export const holdSeats = async (req, res, next) => {
  const {
    userId,
    scheduleId,
    fromStopId,
    toStopId,
    selectedSeatIds,
    selectedClassId,
    date,
  } = req.body;
  console.log(req.body);
  const selectedClass = await CoachType.findById(selectedClassId).select(
    "priceFactor"
  ); // get the selected class using the selectedClassId
  const fromStop = await Stop.findById(fromStopId).select("price"); // get the from stop using the fromStopId
  const toStop = await Stop.findById(toStopId).select("price"); // get the to stop using the toStopId
  const seatPrice = selectedClass.priceFactor * (toStop.price - fromStop.price); // calculate the total amount
  const holdExpiry = new Date(Date.now() + 5 * 60 * 1000); // 12 minutes from now
  const booking = new Booking({
    userRef: userId,
    scheduleRef: scheduleId,
    date: new Date(date),
    from: fromStopId,
    to: toStopId,
    totalAmount: seatPrice * selectedSeatIds.length,
    status: "hold",
    seats: selectedSeatIds,
    holdExpiry, // store the expiry time of the hold
  });
  await booking.save();
  for (let seatId of selectedSeatIds) {
    const bookedSeat = new BookedSeat({
      bookingRef: booking._id,
      seatRef: seatId,
      amount: seatPrice,
    });
    await bookedSeat.save();
  }
  console.log("booking", booking);
  return res
    .status(200)
    .json({ bookingId: booking._id, expireTime: holdExpiry });
};

export const confirmBooking = async (req, res, next) => {
  const bookingId = req.params.id;
  const booking = await Booking.findById(bookingId)
    .populate({
      path: "seats",
      select: "name", // Only select the name field
    })
    .populate({
      path: "userRef",
      select: "email firstName lastName",
    })
    .populate({
      path: "from",
      select: "stationRef platform arrivalTime departureTime",
      populate: {
        path: "stationRef",
      },
    })
    .populate({
      path: "to",
      select: "stationRef arrivalTime",
      populate: {
        path: "stationRef",
      },
    });

  booking.status = "confirmed";
  booking.holdExpiry = undefined;
  await booking.save();

  // Find the user by ID
  // const user = await User.findById(userId);
  // if (!user) {
  //   return res.status(404).json({ message: "User not found" });
  // }

  //   // Generate PDFs for each seat
  //   const pdfBuffers = await generateETickets(booking);

  //   // Send email to the user with e-tickets
  //   await sendConfirmationEmail(user.email, pdfBuffers);

  return res.status(200).json({ booking });
};

// const generateETickets = async (booking) => {
//   const pdfBuffers = [];

//   for (const seat of booking.seats) {
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([600, 300]);
//     const { width, height } = page.getSize();
//     const fontSize = 20;

//     page.drawText(`Booking ID: ${booking._id}`, {
//       x: 50,
//       y: height - 4 * fontSize,
//       size: fontSize,
//     });

//     page.drawText(
//       `User: ${booking.userRef.firstName} ${booking.userRef.lastName}`,
//       {
//         x: 50,
//         y: height - 6 * fontSize,
//         size: fontSize,
//       }
//     );

//     page.drawText(`Seat: ${seat.name}`, {
//       x: 50,
//       y: height - 8 * fontSize,
//       size: fontSize,
//     });

//     page.drawText(`From: ${booking.from.stationRef.name}`, {
//       x: 50,
//       y: height - 10 * fontSize,
//       size: fontSize,
//     });

//     page.drawText(`To: ${booking.to.stationRef.name}`, {
//       x: 50,
//       y: height - 12 * fontSize,
//       size: fontSize,
//     });

//     page.drawText(`Date: ${booking.date}`, {
//       x: 50,
//       y: height - 14 * fontSize,
//       size: fontSize,
//     });

//     page.drawText(`Amount: ${seat.amount}`, {
//       x: 50,
//       y: height - 16 * fontSize,
//       size: fontSize,
//     });

//     const pdfBytes = await pdfDoc.save();
//     pdfBuffers.push(pdfBytes);
//   }

//   return pdfBuffers;
// };

// const sendConfirmationEmail = async (userEmail, pdfBuffers) => {
//   // Create a transporter
//   let transporter = nodemailer.createTransport({
//     service: "gmail", // or another email service
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   // Email content
//   let mailOptions = {
//     from: process.env.EMAIL,
//     to: userEmail,
//     subject: "Booking Confirmation",
//     text: "Your booking has been confirmed. Please find your e-tickets attached.",
//     attachments: pdfBuffers.map((buffer, index) => ({
//       filename: `e-ticket-${index + 1}.pdf`,
//       content: buffer,
//       contentType: "application/pdf",
//     })),
//   };

//   // Send the email
//   await transporter.sendMail(mailOptions);
// };

export const cancelBooking = async (req, res, next) => {
  const bookingId = req.params.id;
  const booking = await Booking.findById(bookingId);
  if(!(booking.userRef.equals(req.user.id))){
    throw new ExpressError("Unauthorized", 401);
  }
  if (booking.date - Date.now() <= 0) {
    throw new ExpressError("Cannot cancel past bookings", 400);
  }
  booking.status = "cancelled";
  booking.holdExpiry = undefined;
  await booking.save();
  return res.status(200).json({ message: "Booking cancelled" });
};

export async function releaseExpiredHolds() {
  const now = new Date();
  const bookings = await Booking.find({
    status: "hold",
    holdExpiry: { $lt: now },
  });
  for (let booking of bookings) {
    booking.status = "cancelled";
    booking.holdExpiry = undefined;
    await booking.save();
  }
}

// export const register = async (req, res, next) => {
//   const { username, firstName, lastName, email, phone, password, gender } =
//     req.body;
//     console.log(req.body)
//   const hashedPassword = await bcryptjs.hash(password, 12);
//   try {
//     const newUser = new User({
//       username,
//       firstName,
//       lastName,
//       email,
//       phone,
//       password: hashedPassword,
//       gender,
//     });

//     await newUser.save();
//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
//     const { password: hashed, ...restOfUser } = newUser._doc;
//     console.log(newUser._doc,token)
//     res
//       .cookie("access_token", token, { httpOnly: true })
//       .status(200)
//       .json(restOfUser);
//   } catch (error) {
//     if (error.keyValue.email) {
//       return res.status(400).json({ message: "Email already exists" });
//     } else if (error.keyValue.username) {
//       return res.status(400).json({ message: "Username already exists" });
//     }
//     console.log(error);
//     next(error);
//   }
// };

export const register = async (req, res, next) => {
  const { username, email, phone, password } = req.body;

  const hashedPassword = await bcryptjs.hash(password, 12);

  try {
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      gender,
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: hashed, ...restOfUser } = newUser._doc;

    // console.log("doc",newUser._doc, "token",token);  // Log the user document and token to debug

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(restOfUser);
  } catch (error) {
    // console.log(error);  // Log the error to understand the structure

    // Improved error handling
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else if (error.code && error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }

    next(error);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  const { password: hashed, ...restOfUser } = user._doc;
  res
    .cookie("access_token", token, { httpOnly: true })
    .status(200)
    .json(restOfUser);
  // .json({sucess:true,...restOfUser});
};

export const logout = (req, res, next) => {
  console.log("logout");
  res.clearCookie("access_token").json({ message: "Logged out" });
};

export const getProfile = async (req, res, next) => {
  console.log("req.user", req.user);
  const user = await User.findById(req.user.id).select("-password");
  console.log("user", user);
  res.status(200).json(user);
};

export const editProfile = async (req, res, next) => {
  const { username, email, phone, oldPassword, newPassword } = req.body;
  console.log("req.user", req.body);
  const user = await User.findById(req.user.id);
  const isMatch = await bcryptjs.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }
  let newUserData = { username, email, phone };
  if (newPassword) {
    const hashedPassword = await bcryptjs.hash(newPassword, 12);
    newUserData.password = hashedPassword;
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: newUserData,
    },
    {
      new: true,
    }
  ).select("-password");
  res.status(200).json(updatedUser);
};

export const getBookingHistory = async (req, res, next) => {
  console.log("inside getBookingHistory")
  const bookings = await Booking.find({ userRef: req.user.id, status: "confirmed"})
    .populate({
      path: "scheduleRef",
      select: "trainRef",
      populate: {
        path: "trainRef",
        select: "name",
      },
    })
    .populate({
      path: "from",
      populate: {
        path: "stationRef",
      },
    })
    .populate({
      path: "to",
      populate: {
        path: "stationRef",
      },
    })
    .sort({ date: -1 });

  res.status(200).json(bookings);
};
