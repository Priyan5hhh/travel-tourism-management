import express from "express";
import Tour from "../models/Tour.js";

const router = express.Router();

// ✅ Get all tours
router.get("/", async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get single tour by ID
router.get("/:id", async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.json(tour);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tour details" });
  }
});

// ✅ Add new tour
router.post("/", async (req, res) => {
  try {
    const { title, description, price, image } = req.body;

    if (!title || !description || !price) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const newTour = new Tour({ title, description, price, image });
    await newTour.save();

    res.status(201).json({ message: "Tour added successfully!", tour: newTour });
  } catch (error) {
    res.status(500).json({ message: "Failed to add tour", error });
  }
});

// ✅ Delete tour
router.delete("/:id", async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.json({ message: "Tour deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete tour", error });
  }
});

export default router;
