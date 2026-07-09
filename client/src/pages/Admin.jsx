import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:5000/api/admin/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      <h4>👥 Users</h4>
      <table className="table table-striped table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="3" className="text-center">No users found</td></tr>
          ) : (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h4 className="mt-5">📘 Bookings</h4>
      <table className="table table-striped table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>User</th>
            <th>Package</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr><td colSpan="4" className="text-center">No bookings found</td></tr>
          ) : (
            bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.userId?.name || "N/A"}</td>
                <td>{b.packageId?.title || "N/A"}</td>
                <td>{new Date(b.travelDate).toLocaleDateString()}</td>
                <td>{b.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
