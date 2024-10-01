import nodemailer from "nodemailer";
import ExpressError from "../../utils/ExpressError.js";

export const sendRescheduleEmails = async (date, schedule, stop, isPlatformChanged, change, userEmails) => {
  // Create a transporter object using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let message;
  if (isPlatformChanged) {
    message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h2 style="color: #4CAF50;">TrainEase - Platform Change Notice</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <p style="font-size: 16px; color: #333;">Dear Passenger,</p>
          <p style="font-size: 16px; color: #333;">
            We would like to inform you that the platform for the <strong>${schedule}</strong> train at <strong>${stop}</strong> on <strong>${date.toDateString()}</strong> has been changed to platform <strong>${change}</strong>.
          </p>
          <p style="font-size: 16px; color: #333;">We apologize for any inconvenience caused and appreciate your understanding.</p>
        </div>
        <div style="padding-top: 20px; text-align: center; border-top: 1px solid #ddd; margin-top: 20px;">
          <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} TrainEase. All rights reserved.</p>
        </div>
      </div>
    `;
  } else {
    message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h2 style="color: #FF9800;">TrainEase - Train Delay Notice</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <p style="font-size: 16px; color: #333;">Dear Passenger,</p>
          <p style="font-size: 16px; color: #333;">
            We would like to inform you that the <strong>${schedule}</strong> train scheduled for <strong>${date.toDateString()}</strong> will be delayed by <strong>${change} minutes</strong> at <strong>${stop}</strong> and onwards.
          </p>
          <p style="font-size: 16px; color: #333;">We apologize for the delay and appreciate your patience.</p>
        </div>
        <div style="padding-top: 20px; text-align: center; border-top: 1px solid #ddd; margin-top: 20px;">
          <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} TrainEase. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  for (const userEmail of userEmails) {
    const mailOptions = {
      from: "railwise21@gmail.com",
      to: userEmail,
      subject: "Booking Reschedule",
      html: message,  // Use HTML for message
    };

    // Send the email
     transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email: " + error);
      } else {
        console.log("Reschedule email sent: " + info.response);
      }
    });
  }
};
