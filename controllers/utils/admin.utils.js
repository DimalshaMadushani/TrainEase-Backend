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
        message = `The platform for the ${schedule} train at ${stop} on ${date.toDateString()} has been changed to ${change}`;
    } else {
        message = `The ${schedule} train on ${date.toDateString()} will be delayed by ${change} minutes at ${stop}`;
    }

    
    for (const userEmail of userEmails) {
        const mailOptions = {
            from: "railwise21@gmail.com",
            to: userEmail,
            subject: "Booking Reschedule",
            text: message
          };
      
          // Send the email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              throw new ExpressError("Failed to send Reschedule emails", 500);
            } else {
              console.log("Reschedule email sent: " + info.response);
            }
          });
    }
};

