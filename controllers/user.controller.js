
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import ExpressError from "../utils/ExpressError.js";
import mongoose from "mongoose";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


export const cancelBooking = async (req, res, next) => {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking.userRef.equals(req.user.id)) {
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
  

  
  