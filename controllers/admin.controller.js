

// Fetch bookings grouped by date
export const getBookingsByDate = async (req, res) => {
    const { startDate, endDate } = req.query;
  
    let start = new Date(startDate);
    let end = new Date(endDate);
  
    // Default to past 30 days if no date range provided
    if (!startDate || !endDate) {
      end = new Date();
      start = new Date();
      start.setDate(end.getDate() - 30);
    }
  
    try {
      const bookings = await Booking.aggregate([
        {
          $match: {
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
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  