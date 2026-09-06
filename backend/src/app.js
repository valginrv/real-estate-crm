const express = require("express");
const cors = require("cors");

const leadRoutes = require("./routes/leadRoutes");

const authRoutes = require("./routes/authRoutes");

const projectRoutes = require("./routes/projectRoutes");

const buildingRoutes = require("./routes/buildingRoutes");

const unitRoutes = require("./routes/unitRoutes");

const bookingRoutes = require("./routes/bookingRoutes");

const userRoutes =
  require("./routes/userRoutes");

  
const dashboardRoutes = require("./routes/dashboardRoutes");





const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Real Estate CRM API is running",
  });
});

app.use("/api/leads", leadRoutes);

app.use(
  "/api/users",
  userRoutes
);

app.use("/api/projects", projectRoutes);

app.use("/api/buildings", buildingRoutes);

app.use("/api/units", unitRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/dashboard", dashboardRoutes);

// const authMiddleware = require("./middleware/authMiddleware");

// app.get("/api/test", authMiddleware, (req, res) => {
//   res.json({
//     message: "Protected API working",
//     user: req.user
//   });
// });

module.exports = app;