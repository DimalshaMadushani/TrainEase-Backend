import nodemailer from "nodemailer";
import ExpressError from "../../utils/ExpressError.js";

export const sendCancellationEmail = async (booking, userEmail) => {
    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const bookingDetails = `Booking ID: ${booking._id}\n` +
                           `Date: ${booking.date.toDateString()}\n` +
                           `From: ${booking.from.stationRef.name}\n` +
                           `To: ${booking.to.stationRef.name}\n` +
                           `Seats: ${booking.seats.length}`;

    // Email options
    const mailOptions = {
      from: "railwise21@gmail.com",
      to: userEmail,
      subject: "Booking Cancellation",
      text: `Your booking has been cancelled. Here are the details:\n${bookingDetails}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new ExpressError("Failed to send cancellation email", 500);
      } else {
        console.log("Cancellation email sent: " + info.response);
      }
    });
};

