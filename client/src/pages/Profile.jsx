import React, { useEffect, useId, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to extract userId from token
  const extractUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token is missing");
    }

    try {
      // Split the JWT into parts
      const payloadBase64 = token.split(".")[1]; // Extract the payload part
      const payload = JSON.parse(atob(payloadBase64)); // Decode the Base64 string to JSON
      return payload.userId; // Assuming `userId` is present in the payload
    } catch (error) {
      throw new Error("Invalid token format");
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Extract userId from token
        const token = localStorage.getItem("token");
        console.log(token)
        const userId = extractUserIdFromToken();
console.log(userId)
        // Make an API call to fetch user details
        const response = await axios.get(`/api/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
console.log(response.data)
        setUser(response.data);
      } catch (err) {
        console.log(err)
        setError(err.message || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Profile Details</h1>
      {user ? (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Referral Code:</strong> {user.referralCode || "N/A"}
          </p>
          <p>
            <strong>Rewards:</strong> {user.rewards}
          </p>
          <p>
            <strong>Verified:</strong>{" "}
            {user.isVerified ? (
              <span className="text-green-500">Yes</span>
            ) : (
              <span className="text-yellow-500">No</span>
            )}
          </p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default ProfilePage;
