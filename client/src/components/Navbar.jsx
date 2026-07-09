import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">TravelSys</Link>

        <div className="ms-auto d-flex align-items-center">
          <Link className="btn btn-outline-light btn-sm me-2" to="/">Home</Link>

          {!token && (
            <>
              <Link className="btn btn-outline-light btn-sm me-2" to="/login">Login</Link>
              <Link className="btn btn-outline-light btn-sm me-2" to="/register">Register</Link>
            </>
          )}

          {token && role === "user" && (
            <>
              <Link className="btn btn-outline-info btn-sm me-2" to="/mybookings">
                My Bookings
              </Link>
            </>
          )}

          {token && role === "admin" && (
            <>
              <Link className="btn btn-outline-warning btn-sm me-2" to="/admin/dashboard">
                Admin
              </Link>
              <Link className="btn btn-outline-success btn-sm me-2" to="/admin/addtour">
                Add Tour
              </Link>
            </>
          )}

          {token && (
            <>
              <span className="text-light me-2">Hi, {name}</span>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
