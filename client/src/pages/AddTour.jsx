import React, { useState } from "react";
import axios from "axios";

export default function AddTour() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/tours", form);
      alert(res.data.message);
      setForm({ title: "", description: "", price: "", image: "" });
    } catch (err) {
      alert("Failed to add tour");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">🗺️ Add New Tour Package</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tour Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter tour name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter details about the tour"
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Paste an image URL (Unsplash, etc.)"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Add Tour
        </button>
      </form>
    </div>
  );
}
