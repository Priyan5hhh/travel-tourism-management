import React, { useState } from "react";
import axios from "axios";

export default function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/user/${email}`);
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🧾 My Bookings</h2>

      <form
        onSubmit={fetchBookings}
        className="d-flex justify-content-center mb-4"
        style={{ maxWidth: "400px", margin: "0 auto" }}
      >
        <input
          type="email"
          className="form-control me-2"
          placeholder="Enter your booking email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-dark">Search</button>
      </form>

      {loading && <p className="text-center">Loading your bookings...</p>}

      {!loading && bookings.length === 0 && (
        <p className="text-center text-muted">No bookings found.</p>
      )}

      {!loading && bookings.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Tour</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b._id}>
                  <td>{i + 1}</td>
                  <td>{b.tourId?.title || "Deleted Tour"}</td>
                  <td>₹{b.tourId?.price || "N/A"}</td>
                  <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
