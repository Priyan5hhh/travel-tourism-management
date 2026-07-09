import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TourDetails from "./pages/TourDetails";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminBookings";
import AddTour from "./pages/AddTour";
import { AdminRoute, UserRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tour/:id" element={<TourDetails />} />

          {/* User Pages */}
          <Route
            path="/mybookings"
            element={
              <UserRoute>
                <MyBookings />
              </UserRoute>
            }
          />

          {/* Admin Pages */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/addtour"
            element={
              <AdminRoute>
                <AddTour />
              </AdminRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
