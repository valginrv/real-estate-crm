const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true
    },

    email: {
      type: String
    },

    source: {
      type: String
    },

    stage: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Site Visit",
        "Interested",
        "Negotiation",
        "Booked",
        "Lost"
      ],
      default: "New"
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    notes: {
      type: String
    },

    followUpDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Lead", leadSchema);