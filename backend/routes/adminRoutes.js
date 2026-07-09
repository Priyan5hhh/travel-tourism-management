import express from "express";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Tour from "../models/Tour.js";

const router = express.Router();

// ✅ Dashboard Summary Counts
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalTours = await Tour.countDocuments();

    res.json({ totalUsers, totalBookings, totalTours });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err });
  }
});

// ✅ Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ Get all bookings (with populated tour & user)
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("tourId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

export default router;
