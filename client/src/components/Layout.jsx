import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-vh-100 bg-light py-4">{children}</main>
      <footer className="bg-dark text-light text-center py-3 mt-4">
        <small>© {new Date().getFullYear()} TravelSys — All rights reserved.</small>
      </footer>
    </>
  );
}
