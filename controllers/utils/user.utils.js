import nodemailer from "nodemailer";

export const sendCancellationEmail = async (booking, userEmail) => {
  // Create a transporter object using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const htmlBody = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px; max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; padding-bottom: 20px;">
      <h1 style="color: #d9534f; margin: 0;">TrainEase - Booking Cancellation</h1>
    </div>
    <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e1e1e1;">
      <p style="font-size: 16px; color: #333;">Hello,</p>
      <p style="font-size: 16px; color: #333;">We regret to inform you that your booking has been successfully cancelled. Below are the details of your cancelled booking:</p>
      
      <ul style="font-size: 16px; color: #333;">
        <li><strong>Booking ID:</strong> ${booking._id}</li>
        <li><strong>Date:</strong> ${booking.date.toDateString()}</li>
        <li><strong>From:</strong> ${booking.from.stationRef.name}</li>
        <li><strong>To:</strong> ${booking.to.stationRef.name}</li>
        <li><strong>Seats:</strong> ${booking.seats.length}</li>
      </ul>

      <p style="font-size: 16px; color: #333;">If you have any questions or need further assistance, please do not hesitate to contact our support team.</p>

      <p style="font-size: 16px; color: #333; margin-top: 20px;">Thank you for using TrainEase.</p>

      <p style="font-size: 16px; color: #333;">Best regards,<br/>TrainEase Team</p>
    </div>
    <footer style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
      <p>This email was sent to ${userEmail}. If you did not request this cancellation, please contact us immediately.</p>
    </footer>
  </div>
`;

// Email options
const mailOptions = {
  from: "railwise21@gmail.com",
  to: userEmail,
  subject: "Booking Cancellation Confirmation",
  html: htmlBody,
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
