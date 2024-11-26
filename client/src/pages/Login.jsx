import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import axios from "axios";
import { AuthContext } from "@/context/authContext.jsx";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userLogedin, setUserLogedin] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticate } = useContext(AuthContext);

  const onSubmit = async (data) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const requestData = {
      email: data.email,
      password: data.password,
    };

    try {
      // Send login request
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        requestData
      );
      console.log(response);
      if (response.status === 200) {
        const { token, message } = response.data;

        // Store token in localStorage
        localStorage.setItem("token", token);
        const userRole = extractUserRoleFromToken();
        console.log(userRole, "role");
        // Display success message
        setSuccessMessage(message || "Login successful!");
        setUserLogedin(true);
        login(token);
        if (userRole == "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/profile");
        }

        // Navigate to profile or any post-login page
      } else {
        // Handle unexpected status codes
        setErrorMessage(response.data.message || "Login failed.");
      }
    } catch (error) {
      // Capture and display errors
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      reset(); // Reset form fields regardless of success or failure
    }
  };
  const extractUserRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token is missing");
    }

    try {
      const payloadBase64 = token.split(".")[1]; // Get the payload part
      const payload = JSON.parse(atob(payloadBase64)); // Decode Base64

      return payload.role;
    } catch (error) {
      throw new Error("Invalid token format or content");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 border border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-500 text-sm mb-4">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <div className="mb-4">
          <Label htmlFor="email" className="block mb-1">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your email"
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <Label htmlFor="password" className="block mb-1">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your password"
          />
          {errors.password && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </Button>
      </form>

      <div className="mt-4 text-center">
        Don't have an account?{" "}
        <Link to={"/sign-up"}>
          <span className="">Sign up</span>
        </Link>
      </div>
    </div>
  );
};

export default Login;
