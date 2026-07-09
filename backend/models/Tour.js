import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: String,
    price: { type: Number, required: true },
    duration: String,
    description: String,
    image: String,
    itinerary: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
