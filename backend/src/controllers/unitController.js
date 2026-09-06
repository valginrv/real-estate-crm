const Unit = require("../models/Unit");

const createUnit = async (req, res) => {
  try {
    const {
      buildingId,
      unitNumber,
      type,
      price
    } = req.body;

    if (!buildingId || !unitNumber || !type || price === undefined) {
      return res.status(400).json({
        message: "Building ID, unit number, type and price are required"
      });
    }

    const unit = await Unit.create({
      buildingId,
      unitNumber,
      type,
      price
    });

    res.status(201).json({
      message: "Unit created successfully",
      unit
    });

  } catch (error) {
    console.error("CREATE UNIT ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getUnits = async (req, res) => {
  try {
    const { status, buildingId } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (buildingId) {
      filter.buildingId = buildingId;
    }

    const units = await Unit.find(filter)
      .populate("buildingId", "name")
      .sort({ createdAt: -1 });

    res.json({
      count: units.length,
      units
    });

  } catch (error) {
    console.error("GET UNITS ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  createUnit,
  getUnits
};