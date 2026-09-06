const express = require("express");

const {
  createSalesUser,
  getSalesUsers
} = require("../controllers/userController");

const authMiddleware =
  require("../middleware/authMiddleware");

const roleMiddleware =
  require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/sales",
  authMiddleware,
  roleMiddleware("admin"),
  createSalesUser
);

router.get(
  "/sales",
  authMiddleware,
  roleMiddleware("admin"),
  getSalesUsers
);

module.exports = router;