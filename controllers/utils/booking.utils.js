import nodemailer from "nodemailer";
import { PDFDocument, rgb } from "pdf-lib";
import Booking from "../../models/booking.model.js";
import ExpressError from "../../utils/ExpressError.js";


export const generateETickets = async (booking) => {
    const pdfBuffers = [];
    // console.log("ticket price", booking.ticketPrice);
  
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
  
  export const sendConfirmationEmail = async (pdfBuffers, userEmail) => {
    // Create a transporter object using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  
    // // Email options
    // const mailOptions = {
    //   from: "railwise21@gmail.com",
    //   to: userEmail,
    //   subject: "Booking Confirmation",
    //   text: "Your booking has been confirmed. Please find your e-tickets attached.",
    //   attachments: pdfBuffers.map((buffer, index) => ({
    //     filename: `e-ticket-${index + 1}.pdf`,
    //     content: buffer,
    //     contentType: "application/pdf",
    //   })),
    // };

    const mailOptions = {
      from: "railwise21@gmail.com",
      to: userEmail,
      subject: "Your TrainEase Booking Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #28a745; margin: 0;">TrainEase - Booking Confirmation</h1>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e1e1e1;">
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">We are pleased to inform you that your booking has been successfully confirmed. <b>Please find your e-tickets attached to this email.</b></p>
            
            <p style="font-size: 16px; color: #333;">We recommend keeping this email and the attached e-tickets for your reference during your journey.</p>
    
            <p style="font-size: 16px; color: #333; margin-top: 20px;">Thank you for choosing TrainEase. We wish you a pleasant journey.</p>
    
            <p style="font-size: 16px; color: #333;">Best regards,<br/>TrainEase Team</p>
          </div>
          <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
            <p>This email was sent to ${userEmail}. If you did not make this booking, please contact us immediately.</p>
          </footer>
        </div>
      `,
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