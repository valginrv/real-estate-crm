const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true
    },

    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bookingAmount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["Confirmed", "Cancelled"],
      default: "Confirmed"
    },

    bookingDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Prevent multiple confirmed bookings for same unit
bookingSchema.index(
  { unitId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "Confirmed"
    }
  }
);

module.exports = mongoose.model("Booking", bookingSchema);