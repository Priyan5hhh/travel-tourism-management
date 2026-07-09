import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalTours: 0, totalBookings: 0, totalUsers: 0 });
  const [tab, setTab] = useState("home");

  const fetchData = async () => {
    try {
      const [toursRes, bookingsRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/tours"),
        axios.get("http://localhost:5000/api/bookings"),
        axios.get("http://localhost:5000/api/admin/stats"),
      ]);
      setTours(toursRes.data);
      setBookings(bookingsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tour?")) return;
    await axios.delete(`http://localhost:5000/api/tours/${id}`);
    fetchData();
  };

  return (
    <div className="container py-5">
      <h3 className="text-center fw-semibold mb-4">Admin Dashboard</h3>

      <div className="d-flex justify-content-center mb-4">
        <button
          className={`btn me-2 ${tab === "home" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setTab("home")}
        >
          Dashboard
        </button>
        <button
          className={`btn me-2 ${tab === "tours" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setTab("tours")}
        >
          Manage Tours
        </button>
        <button
          className={`btn ${tab === "bookings" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setTab("bookings")}
        >
          View Bookings
        </button>
      </div>

      {tab === "home" && (
        <div className="row text-center">
          <div className="col-md-4">
            <div className="card bg-primary text-white shadow-sm p-4 mb-3">
              <h5>Total Tours</h5>
              <h2>{stats.totalTours}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white shadow-sm p-4 mb-3">
              <h5>Total Bookings</h5>
              <h2>{stats.totalBookings}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-dark shadow-sm p-4 mb-3">
              <h5>Total Users</h5>
              <h2>{stats.totalUsers}</h2>
            </div>
          </div>
        </div>
      )}

      {tab === "tours" && (
        <div>
          <h5 className="mb-3">All Tours</h5>
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour._id}>
                    <td>{tour.title}</td>
                    <td>{tour.description}</td>
                    <td>₹{tour.price}</td>
                    <td>
                      <img
                        src={tour.image}
                        alt={tour.title}
                        style={{ width: "80px", borderRadius: "6px" }}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(tour._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div>
          <h5 className="mb-3">All Bookings</h5>
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Tour</th>
                  <th>Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.userName}</td>
                    <td>{b.userEmail}</td>
                    <td>{b.tourId?.title}</td>
                    <td>₹{b.tourId?.price}</td>
                    <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
