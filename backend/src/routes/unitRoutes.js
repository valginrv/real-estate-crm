const express = require("express");

const {
  createUnit,
  getUnits
} = require("../controllers/unitController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createUnit);

router.get("/", authMiddleware, getUnits);

module.exports = router;