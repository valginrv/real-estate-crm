const express = require("express");

const {
  login,
  register
} = require("../controllers/authController");

const authMiddleware =
  require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

module.exports = router;