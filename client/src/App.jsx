import React, { useContext, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AuthContext } from "./context/authContext.jsx";

export default function App() {
  const location = useLocation();

  const { login, logout, isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    // Check if a token exists in local storage or cookies
    const storedToken = localStorage.getItem("token"); // Change this to your token name
    console.log(isAuthenticated);
    if (storedToken) {
      // Validate the token (e.g., verify its signature on the server)
      // If the token is valid, log the user in with the token
      login(storedToken);
    } else {
      // No token found; the user is not authenticated
      logout();
    }
  }, [isAuthenticated]);

  // Define routes where the Navbar should be hidden
  const hideNavbarRoutes = ["/admin-dashboard"];

  return (
    <div className="">
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* Conditionally render Navbar */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              !isAuthenticated ? <Login /> : <Profile/>
            }
          />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/admin-signin" element={<Profile />} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
