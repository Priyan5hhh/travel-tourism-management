import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/tours/${id}`)
      .then((res) => {
        setTour(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tour details:", err);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = async () => {
    const userName = prompt("Enter your name:");
    const userEmail = prompt("Enter your email:");

    if (!userName || !userEmail) {
      alert("Booking cancelled.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/bookings", {
        tourId: id,
        userName,
        userEmail,
      });
      alert("🎉 Booking Successful!");
      navigate("/"); // back to home
    } catch (error) {
      alert("Booking failed, try again.");
      console.error(error);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (!tour) {
    return <p className="text-center mt-5 text-danger">Tour not found!</p>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <div className="card shadow-lg border-0">
        <img
          src={tour.image || "https://via.placeholder.com/800x400"}
          className="card-img-top"
          alt={tour.title}
        />
        <div className="card-body">
          <h2 className="card-title">{tour.title}</h2>
          <p className="text-muted">{tour.description}</p>
          <h4 className="fw-bold">Price: ₹{tour.price}</h4>
          <button onClick={handleBooking} className="btn btn-dark w-100 mt-3">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
