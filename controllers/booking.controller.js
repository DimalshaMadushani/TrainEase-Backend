
import Stop from "../models/stop.model.js";
import Booking from "../models/booking.model.js";
import CoachType from "../models/coachType.model.js";
import ExpressError from "../utils/ExpressError.js";
import {PDFDocument,rgb} from "pdf-lib";
import nodemailer from "nodemailer";


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
      await sendConfirmationEmail(pdfBuffers);
  
    return res.status(200).json({ booking });
  };
  
  const generateETickets = async (booking) => {
    const pdfBuffers = [];
    console.log("ticket price", booking.ticketPrice);
  
    for (const seat of booking.seats) {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 300]);
      const { width, height } = page.getSize();
      const fontSize = 20;
  
      page.drawText(`Booking ID: ${booking._id}`, {
        x: 50,
        y: height - 4 * fontSize,
        size: fontSize,
      });
  
      page.drawText(
        `User: ${booking.userRef.username} (${booking.userRef.email})`,
        {
          x: 50,
          y: height - 6 * fontSize,
          size: fontSize,
        }
      );
  
      page.drawText(`Seat: ${seat.name}`, {
        x: 50,
        y: height - 8 * fontSize,
        size: fontSize,
      });
  
      page.drawText(`From: ${booking.from.stationRef.name}`, {
        x: 50,
        y: height - 10 * fontSize,
        size: fontSize,
      });
  
      page.drawText(`To: ${booking.to.stationRef.name}`, {
        x: 50,
        y: height - 12 * fontSize,
        size: fontSize,
      });
  
      page.drawText(`Date: ${booking.date.toDateString()}`, {
        x: 50,
        y: height - 14 * fontSize,
        size: fontSize,
      });
  
      page.drawText(`Amount: ${booking.ticketPrice}}`, {
        x: 50,
        y: height - 16 * fontSize,
        size: fontSize,
      });
  
      const pdfBytes = await pdfDoc.save();
      pdfBuffers.push(pdfBytes);
    }
  
    console.log("PDFs generated");
  
    return pdfBuffers;
  };
  
  const sendConfirmationEmail = async (pdfBuffers) => {
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD)
    // Create a transporter object using Gmail SMTP
    const userEmail = "madushaniagd@gmail.com"
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    // Email options
    const mailOptions = {
      from: "railwise21@gmail.com",
      to: userEmail,
      subject: "Booking Confirmation",
      text: "Your booking has been confirmed. Please find your e-tickets attached.",
      attachments: pdfBuffers.map((buffer, index) => ({
        filename: `e-ticket-${index + 1}.pdf`,
        content: buffer,
        contentType: "application/pdf",
      })),
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new ExpressError("Failed to send email", 500);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  };
