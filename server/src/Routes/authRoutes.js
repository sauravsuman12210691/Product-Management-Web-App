const express = require("express");
const mongoose = require("mongoose");
const user = require("../models/userModel");
const getuser = require("../middleware/getuserMiddile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const jwt_SECRT = process.env.Secrate;

const router = express.Router();



// http://localhost:5000/api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" }); // Added return
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" }); // Added return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Some error occurred", details: err.message });
  }
});

// http://localhost:3000/api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const avilUser = await user.findOne({ email });
    console.log(avilUser);
    if (!avilUser) {
      return res.send({ authentication: false });
    }
    const isMatch = await bcrypt.compare(password, avilUser.password);
    // const isMatch = password == avilUser.password;
    if (!isMatch) {
      return res.send({ authentication: false });
    }
    const data = {
      user: {
        id: avilUser.id,
      },
    };

    const awthToken = jwt.sign(data, jwt_SECRT);
    return res.send({ authentication: true, token: awthToken });
  } catch (err) {
    res.status(500).json({ error: "Some error occurs", err });
  }
});

// to get user details ----> http://localhost:3000/api/auth/dashboard
router.get("/dashboard", getuser, async (req, res) => {
  try {
    let userId = req.user.id;
    let userdetails = await user.findById(userId).select("-password");
    res.send(userdetails);
  } catch (err) {
    res.status(500).json({ error: "Some error occurs", err });
  }
});

module.exports = router;