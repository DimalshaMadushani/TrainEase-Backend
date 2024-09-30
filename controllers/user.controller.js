
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";
import mongoose from "mongoose";
import crypto from "crypto";
// import { sendEmail } from "./utils/user.utils.js";
import nodemailer from "nodemailer";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendCancellationEmail } from "./utils/user.utils.js";


export const cancelBooking = async (req, res, next) => {
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
    if (!booking.userRef.equals(req.user.id)) {
      throw new ExpressError("Unauthorized", 401);
    }
    if (booking.date - Date.now() <= 0) {
      throw new ExpressError("Cannot cancel past bookings", 400);
    }
    booking.status = "cancelled";
    booking.holdExpiry = undefined;
    await booking.save();
    console.log("booking", booking);
    await sendCancellationEmail(booking, booking.userRef.email);
    
    return res.status(200).json({ message: "Booking cancelled" });
  };
  

  export const register = async (req, res, next) => {
    const { username, email, phone, password } = req.body;
  
    const hashedPassword = await bcryptjs.hash(password, 12);
  
    try {
      const newUser = new User({
        username,
        email,
        phone,
        password: hashedPassword,
      });
  
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashed, ...restOfUser } = newUser._doc;
  
  
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(restOfUser);
    } catch (error) {
  
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
    res.clearCookie("access_token").json({ message: "Logged out" });
  };
  
  export const getProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next(new ExpressError("User not found", 404));}
    res.status(200).json(user);
  };
  
  export const editProfile = async (req, res, next) => {
    const { username, email, phone, oldPassword, newPassword } = req.body;
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
    const bookings = await Booking.find({
      userRef: req.user.id,
      status: "confirmed",
    })
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
  
//forgot password function
  export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 3600000; // Token valid for 1 hour
  await user.save();

   // Send email
   const transporter = nodemailer.createTransport({
    service: 'Gmail', // or any other email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
  const mailOptions = {
    to: user.email,
    from: 'passwordreset@trainbooking.com',
    subject: 'Password Reset Request',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <div style="text-align: center; padding-bottom: 20px;">
        <h2 style="color: #4CAF50;">Railwise - Password Reset</h2>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">
          We received a request to reset your password for your Railwise account. If you did not request this, please ignore this email.
        </p>
        <p style="font-size: 16px; color: #333;">
          To reset your password, please click the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 25px; font-size: 16px; font-weight: bold; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #555;">
          If the button above doesn’t work, you can copy and paste the following link into your browser:
        </p>
        <p style="word-break: break-all; font-size: 14px; color: #4CAF50;">
          <a href="${resetUrl}" style="color: #4CAF50;">${resetUrl}</a>
        </p>
      </div>
      <div style="padding-top: 20px; text-align: center; border-top: 1px solid #ddd; margin-top: 20px;">
        <p style="font-size: 12px; color: #999;">
          If you did not request this password reset, please contact our support team or ignore this email. Your password will remain unchanged.
        </p>
        <p style="font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} Railwise. All rights reserved.
        </p>
      </div>
    </div>
    `,

  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).send('Error sending email');
    }
    res.send('Email sent successfully');
  });
};

 
//reset password function
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  // console.log("req.body", req.body);

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },  // Check if token is still valid
  });

  if (!user) {
    // console.log("Before Invalid or expired token");
    return res.status(400).send('Invalid or expired token');
  }

  // Update password
  const hashedPassword = await bcryptjs.hash(newPassword, 12);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;  // Remove token
  user.resetPasswordExpire = undefined; // Remove expiration
  await user.save();

  res.send('Password has been reset successfully');
};