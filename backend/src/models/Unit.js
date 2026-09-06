const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Building",
      required: true
    },

    unitNumber: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["1BHK", "2BHK", "3BHK", "4BHK"],
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["Available", "Booked"],
      default: "Available"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Unit", unitSchema);