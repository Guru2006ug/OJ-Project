// Controller/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      return res.status(400).send("All fields are required.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already exists.");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    const token = jwt.sign(
      { id: user._id, email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    user.token = token;
    user.password = undefined;

    res.status(200).json({ message: "User registered successfully!", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send("Email and password are required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid credentials.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials.");
    }

    const token = jwt.sign(
      { id: user._id, email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    user.token = token;
    user.password = undefined;

    res.status(200).json({
      message: "Login successful!",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};


exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};

