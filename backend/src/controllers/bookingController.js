const Booking = require("../models/Booking");
const Unit = require("../models/Unit");
const Lead = require("../models/lead");

const createBooking = async (req, res) => {
  try {

    const {
      leadId,
      unitId,
      bookingAmount
    } = req.body;


    // ===============================
    // VALIDATION
    // ===============================

    if (
      !leadId ||
      !unitId ||
      bookingAmount === undefined
    ) {
      return res.status(400).json({
        message:
          "Lead, unit and booking amount are required"
      });
    }


    // ===============================
    // CHECK LEAD
    // ===============================

    const lead =
      await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }


    // ===============================
    // ATOMICALLY BOOK UNIT
    // ===============================

    const unit =
      await Unit.findOneAndUpdate(
        {
          _id: unitId,
          status: "Available"
        },
        {
          $set: {
            status: "Booked"
          }
        },
        {
          new: true
        }
      );


    // Unit was already booked
    if (!unit) {

      return res.status(409).json({
        message:
          "This unit is already booked"
      });

    }


    // ===============================
    // CREATE BOOKING
    // ===============================

    try {

      const booking =
        await Booking.create({
          leadId,
          unitId,
          bookedBy: req.user.userId,
          bookingAmount,
          status: "Confirmed"
        });


      // ===============================
      // UPDATE LEAD
      // ===============================

      lead.stage = "Booked";

      await lead.save();


      return res.status(201).json({
        message:
          "Booking created successfully",
        booking
      });


    } catch (error) {

      // If booking creation fails,
      // release the unit again

      await Unit.findByIdAndUpdate(
        unitId,
        {
          $set: {
            status: "Available"
          }
        }
      );


      if (error.code === 11000) {

        return res.status(409).json({
          message:
            "This unit is already booked"
        });

      }

      throw error;
    }


  } catch (error) {

    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });

  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("leadId", "name phone email")
      .populate("unitId", "unitNumber type price status")
      .populate("bookedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  createBooking,
  getBookings
};