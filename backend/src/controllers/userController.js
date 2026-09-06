const User = require("../models/user");
const bcrypt = require("bcryptjs");

const createSalesUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const existingUser = await User.findOne({
      email
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "sales"
    });

    res.status(201).json({
      message: "Sales employee created successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.error(
      "CREATE SALES USER ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });

  }
};


const getSalesUsers = async (req, res) => {
  try {

    const users = await User.find({
      role: "sales"
    })
      .select("-password")
      .sort({ name: 1 });

    res.json({
      count: users.length,
      users
    });

  } catch (error) {

    console.error(
      "GET SALES USERS ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });

  }
};


module.exports = {
  createSalesUser,
  getSalesUsers
};