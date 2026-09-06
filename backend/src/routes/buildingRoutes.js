const express = require("express");

const {
  createBuilding,
  getBuildings
} = require("../controllers/buildingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createBuilding);

router.get("/", authMiddleware, getBuildings);

module.exports = router;