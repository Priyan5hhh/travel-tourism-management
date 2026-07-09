import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// ✅ Create a booking
router.post("/", async (req, res) => {
  try {
    const { tourId, userName, userEmail } = req.body;
    if (!tourId || !userName || !userEmail) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newBooking = new Booking({ tourId, userName, userEmail });
    await newBooking.save();

    res.status(201).json({ message: "Booking successful!", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
});

// ✅ Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("tourId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ Get bookings by user email
router.get("/user/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const bookings = await Booking.find({ userEmail: email }).populate("tourId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings" });
  }
});

export default router;
