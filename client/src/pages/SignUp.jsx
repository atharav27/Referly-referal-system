// src/pages/Signup.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setSuccessMessage(null);

    // Make sure you include the referral code from the form data if available
    const requestData = {
      name: data.name,
      email: data.email,
      password: data.password,
      referralCode: data.referralCode || "", // Optional referral code
    };

    try {
      // Sending data to the backend API
      const response = await axios.post("/api/auth/signup", requestData);

      // Check for successful signup response
      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        reset();
        navigate("/sign-in") // Reset form fields after success
      } else {
        setSuccessMessage(response.data.message || "Signup failed.");
      }
    } catch (error) {
      // Error handling
      if (error.response) {
        setSuccessMessage(error.response.data.message || "Signup failed.");
      } else {
        setSuccessMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Signup for Referly
        </h1>
        {successMessage && (
          <div
            className={`mb-4 p-3 text-sm rounded ${
              successMessage.includes("successful")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Input
              type="text"
              id="name"
              placeholder="John Doe"
              {...register("name", { required: "Name is required" })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none sm:text-sm ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              type="email"
              id="email"
              placeholder="example@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none sm:text-sm ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none sm:text-sm ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Referral Code Input */}
          <div>
            <label
              htmlFor="referralCode"
              className="block text-sm font-medium text-gray-700"
            >
              Referral Code (Optional)
            </label>
            <Input
              type="text"
              id="referralCode"
              placeholder="REF123"
              {...register("referralCode")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none sm:text-sm"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 `}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center">
        Already have an account?
        <Link to={"/sign-in"}>
          <span className="">Sign In</span>
        </Link>
      </div>
      </div>
      
    </div>
  );
};

export default SignUp;
