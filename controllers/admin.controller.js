import Booking from "../models/booking.model.js";
import Schedule from "../models/schedule.model.js";
import Train from "../models/train.model.js";
import Admin from "../models/admin.model.js";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";


// Utility function to generate an array of dates between two dates
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

export const getTrains = async (req, res, next) => {
  const trains = await Train.find({}).select('_id name');
  res.status(200).json(trains);
};

// Fetch bookings grouped by date
export const getBookingsByDate = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { scheduleId } = req.params;

    let start = new Date(startDate);
    let end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set end time to the end of the day

    // Default to past 30 days if no date range provided
    if (!startDate || !endDate) {
      end = new Date();
      start = new Date();
      start.setDate(end.getDate() - 30);
    }

    try {
      // Generate all dates within the range
      const dateRange = generateDateRange(start, end);

      const bookings = await Booking.aggregate([
        {
          $match: {
            status: "confirmed", // Only confirmed bookings
            date: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Convert the results to an object with dates as keys
      const bookingsMap = bookings.reduce((acc, booking) => {
        acc[booking._id] = booking.count;
        return acc;
      }, {});
      console.log(bookingsMap);

      // Map over the dateRange to ensure all dates are covered
      const result = dateRange.map(date => {
        const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
        return {
          _id: formattedDate,
          count: bookingsMap[formattedDate] || 0,
        };
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  // Fetch bookings grouped by date with revenue
export const getRevenue = async (req, res) => {
  const { startDate, endDate } = req.query;

  let start = new Date(startDate);
  let end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Set end time to the end of the day

  // Default to past 30 days if no date range provided
  if (!startDate || !endDate) {
    end = new Date();
    start = new Date();
    start.setDate(end.getDate() - 30);
  }

  try {
    // Generate all dates within the range
    const dateRange = generateDateRange(start, end);

    const bookings = await Booking.aggregate([
      {
        $match: {
          status: "confirmed", // Only confirmed bookings
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }, // Sum the totalAmount for each date
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Convert the results to an object with dates as keys
    const bookingsMap = bookings.reduce((acc, booking) => {
      acc[booking._id] = {
        count: booking.count,
        totalRevenue: booking.totalRevenue,
      };
      return acc;
    }, {});

    // Map over the dateRange to ensure all dates are covered
    const result = dateRange.map(date => {
      const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
      return {
        _id: formattedDate,
        count: bookingsMap[formattedDate]?.count || 0,
        totalRevenue: bookingsMap[formattedDate]?.totalRevenue || 0,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Fetch bookings grouped by date and schedule
export const getBookingsByDateAndSchedule = async (req, res) => {
    const { startDate, endDate,trainId } = req.query;
    

    let start = new Date(startDate);
    let end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set end time to the end of the day

    // Default to past 30 days if no date range provided
    if (!startDate || !endDate) {
      end = new Date();
      start = new Date();
      start.setDate(end.getDate() - 30);
    }

    try {
      // Generate all dates within the range
      const dateRange = generateDateRange(start, end);

      // Find all schedules for the given trainId
      const schedules = await Schedule.find({ trainRef: new mongoose.Types.ObjectId(trainId) });

      if (schedules.length === 0) {
        return res.status(404).json({ message: "No schedules found for this train." });
      }

      const scheduleIds = schedules.map(schedule => schedule._id);

      const bookings = await Booking.aggregate([
        {
          $match: {
            scheduleRef: { $in: scheduleIds }, // Match by scheduleIds
            status: "confirmed", // Only confirmed bookings
            date: {
              $gte: start,
              $lte: end,
            },
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              scheduleRef: "$scheduleRef",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]);

      // Create a map of bookings
      const bookingsMap = bookings.reduce((acc, booking) => {
        const date = booking._id.date;
        const scheduleRef = booking._id.scheduleRef.toString();
        if (!acc[date]) {
          acc[date] = {};
        }
        acc[date][scheduleRef] = booking.count;
        return acc;
      }, {});

      // Prepare the result
      const result = dateRange.map(date => {
        const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
        const scheduleCounts = schedules.map(schedule => {
          return {
            scheduleId: schedule._id.toString(),
            count: bookingsMap[formattedDate]?.[schedule._id.toString()] || 0,
          };
        });
        return {
          date: formattedDate.slice(2), // Format to YY-MM-DD
          scheduleCounts,
        };
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };




  // Fetch number of users registered grouped by date
export const getUserRegistrations = async (req, res) => {
  // console.log("in user registration",req.query)
  const { startDate, endDate } = req.query;

  let start = new Date(startDate);
  let end = new Date(endDate);
  // start.setHours(0, 0, 0, 0); // Set start time to the beginning of the day

  end.setHours(23, 59, 59, 999); // Set end time to the end of the day

  try {
    // Generate all dates within the range
    const dateRange = generateDateRange(start, end);
    // console.log("dateRange",dateRange)
    const registrations = await Admin.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // console.log("registrations",registrations)

    // Convert the results to an object with dates as keys
    const registrationsMap = registrations.reduce((acc, registration) => {
      acc[registration._id] = registration.count;
      return acc;
    }, {});

    // Map over the dateRange to ensure all dates are covered
    const result = dateRange.map(date => {
      const formattedDate = date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
      return {
        _id: formattedDate,
        count: registrationsMap[formattedDate] || 0,
      };
    });
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// //profile details fetch
// export const getProfileDetails = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     const user = await User.findById(userId).select("-password");
//     res.status(200).json(user);
//   }
//   catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// }

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.body, "in admin")
  const user = await Admin.findOne({ username });
  console.log(user, "user")
  if (!user) {
    console.log("user not found")
    return res.status(400).json({ message: "Invalid username or password" });
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    console.log("password not match")
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

//used inside the private route in the frontend

export const getProfile = async (req, res, next) => {
  const user = await Admin.findById(req.user.id).select("-password");
  if (!user) {
    return next(new ExpressError("User not found", 404));}
  res.status(200).json(user);
};

//controller to get Schedule with names
export const getSchedule = async (req, res, next) => {
  const schedules = await Schedule.find({}).populate({path:'trainRef', select:'_id name'}).select('_id trainRef');
  console.log(schedules)
  res.status(200).json(schedules);
};