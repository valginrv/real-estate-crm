const Lead = require("../models/lead");
const Booking = require("../models/Booking");
const Unit = require("../models/Unit");

const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();

    const newLeads = await Lead.countDocuments({
      stage: "New"
    });

    const followUps = await Lead.countDocuments({
      followUpDate: {
        $ne: null
      }
    });

    const totalBookings = await Booking.countDocuments({
      status: "Confirmed"
    });

    const availableUnits = await Unit.countDocuments({
      status: "Available"
    });

    const bookedUnits = await Unit.countDocuments({
      status: "Booked"
    });

    res.json({
      totalLeads,
      newLeads,
      followUps,
      totalBookings,
      availableUnits,
      bookedUnits
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  getDashboardStats
};