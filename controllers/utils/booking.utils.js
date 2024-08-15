import nodemailer from "nodemailer";
import { PDFDocument, rgb } from "pdf-lib";
import Booking from "../../models/booking.model.js";


export const generateETickets = async (booking) => {
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
  
  export const sendConfirmationEmail = async (pdfBuffers) => {
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