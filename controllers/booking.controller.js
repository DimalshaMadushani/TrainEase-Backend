
import Stop from "../models/stop.model.js";
import Booking from "../models/booking.model.js";
import CoachType from "../models/coachType.model.js";
import { generateETickets,sendConfirmationEmail } from "./utils/booking.utils.js";



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
    const selectedClass = await CoachType.findById(selectedClassId).select(
      "priceFactor"
    ); // get the selected class using the selectedClassId
    const fromStop = await Stop.findById(fromStopId).select("price"); // get the from stop using the fromStopId
    const toStop = await Stop.findById(toStopId).select("price"); // get the to stop using the toStopId
    const seatPrice = selectedClass.priceFactor * (toStop.price - fromStop.price); // calculate the total amount
    const holdExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
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
  
    return res
      .status(200)
      .json({ bookingId: booking._id, expireTime: holdExpiry });
  };
  
  export const confirmBooking = async (req, res, next) => {
    const bookingId = req.params.id;
    console.log("bookingId", bookingId);
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "seats",
        select: "name", // Only select the name field
      })
      .populate({
        path: "userRef",
        select: "email username",
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
    console.log("booking", booking);
  
  
      // Generate PDFs for each seat
      const pdfBuffers = await generateETickets(booking);
  
      // Send email to the user with e-tickets
      await sendConfirmationEmail(pdfBuffers, booking.userRef.email);
  
    return res.status(200).json({ booking });
  };

