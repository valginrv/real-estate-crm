const Building = require("../models/Building");

const createBuilding = async (req, res) => {
  try {
    const { projectId, name } = req.body;

    if (!projectId || !name) {
      return res.status(400).json({
        message: "Project ID and building name are required"
      });
    }

    const building = await Building.create({
      projectId,
      name
    });

    res.status(201).json({
      message: "Building created successfully",
      building
    });

  } catch (error) {
    console.error("CREATE BUILDING ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.find()
      .populate("projectId", "name location")
      .sort({ createdAt: -1 });

    res.json({
      count: buildings.length,
      buildings
    });

  } catch (error) {
    console.error("GET BUILDINGS ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  createBuilding,
  getBuildings
};