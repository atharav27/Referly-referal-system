import React from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
// import About from "./pages/About";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/admin-dashboard" element={<Profile />} />
        <Route path="/admin-signin" element={<Profile />} />
      </Routes>
      {/* <Footer/> */}
    </div>
  );
}
