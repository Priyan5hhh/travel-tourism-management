import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tours")
      .then((res) => setTours(res.data))
      .catch((err) => console.error("Error fetching tours:", err));
  }, []);

  const handleBooking = async (tourId) => {
    if (!token) {
      alert("Please login to book a tour");
      navigate("/login");
      return;
    }

    try {
      const email = prompt("Enter your registered email to confirm booking:");
      await axios.post("http://localhost:5000/api/bookings", {
        tourId,
        userName: name,
        userEmail: email,
      });
      alert("Booking successful!");
    } catch {
      alert("Booking failed. Please try again later.");
    }
  };

  return (
    <>
      {/* === HERO SECTION === */}
      <div className="hero-section position-relative text-light d-flex align-items-center justify-content-center">
        <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100"></div>
        <div className="text-center position-relative z-2">
          <h1 className="display-5 fw-bold mb-3">
            Discover Your Next Adventure
          </h1>
          <p className="lead mb-4">
            Explore destinations, book tours, and travel the world effortlessly.
          </p>
          <button
            className="btn btn-light btn-lg fw-semibold"
            onClick={() =>
              window.scrollTo({ top: 500, behavior: "smooth" })
            }
          >
            Browse Packages
          </button>
        </div>
      </div>

      {/* === TOUR LIST === */}
      <div className="container py-5">
        <h2 className="text-center mb-4 fw-semibold">Available Tour Packages</h2>
        <div className="row">
          {tours.length === 0 ? (
            <p className="text-center text-muted">
              No tours available at the moment.
            </p>
          ) : (
            tours.map((tour) => (
              <div key={tour._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={tour.image || "https://via.placeholder.com/300x200"}
                    className="card-img-top"
                    alt={tour.title}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">{tour.title}</h5>
                    <p className="text-muted small">
                      {tour.description?.substring(0, 90)}...
                    </p>
                    <p className="fw-bold mb-3">Price: ₹{tour.price}</p>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-dark w-50"
                        onClick={() => navigate(`/tour/${tour._id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn btn-dark w-50"
                        onClick={() => handleBooking(tour._id)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
