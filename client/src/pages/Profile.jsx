import React, { useEffect, useId, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState();
  const [showOtpField, SetShowOtpField] = useState(false);
  const [referredUsers, setReferredUsers] = useState([]);
  const navigate = useNavigate();

  // Function to extract userId from token
  const extractUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token is missing");
    }

    try {
      // Split the JWT into parts
      const payloadBase64 = token.split(".")[1]; // Extract the payload part
      const payload = JSON.parse(atob(payloadBase64));
      // const id = payload.id// Decode the Base64 string to JSON
      console.log(payload.id, "kighsfdhgfhds")
      return payload.id; // Assuming `userId` is present in the payload
    } catch (error) {
      throw new Error("Invalid token format");
    }
  };
  // fetching user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
       
        const token = localStorage.getItem("token");
        // console.log(token);
        const userId = extractUserIdFromToken();
        console.log(userId,"sfhgfsdhgfd");
        // console.log(userId);
        // Make an API call to fetch user details
        const response = await axios.get(`/api/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        // console.log(response.data);
        setUser(response.data.data);
      } catch (err) {
        console.log(err);
        setError(err.message || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);
  //runnin function to get otp at email
  const handleSendOtp = async () => {
    const email = user.email;
    // console.log(email);
    try {
      const response = await axios.post("/api/auth/send-verification-otp", {
        email,
      });
      console.log(response);
      setMessage(response.data.message);
      alert(response.data.otp);
      // console.log(message)
      SetShowOtpField(true);
      setStep("verifyOtp");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP.");
    }
  };

  // varify otp
  const handleVerifyOtp = async () => {
    const email = user.email;
    console.log({ email, otp });
    try {
      const response = await axios.post("/api/auth/verify-otp", { email, otp });
      setMessage(response.data.message);
      setOtp(""); // Clear the OTP field on success
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Error verifying OTP.");
    }
  };

const handleFetchRefrals = async () => {
  console.log("Fetching referrals...");

  const token = localStorage.getItem("token");
  const userId = extractUserIdFromToken(); // Extract userId from the token

  // console.log("UserId:", userId);
  // console.log("Token:", token);

  try {
    setLoading(true);
    const response = await axios.get(`/api/referal/referals/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    // console.log("Response:", response);
    setReferredUsers(response.data.data);
    console.log(referredUsers)
  } catch (error) {
    console.log("Error:", error);
    setError(error.response?.data?.message || "Failed to fetch referred users.");
  } finally {
    setLoading(false);
  }
};
const handleSignOut = () => {
  localStorage.removeItem("token"); // Clear the token
  navigate("/sign-in"); // Redirect to the login page
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mt-16 mx-10">
      <div className="sm:max-w-xl overflow-hidden mx-auto  py-4 px-8 border rounded shadow">
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
              <strong>Referal Status:</strong>{" "}
              {user.isVerified ? (
                <span className="text-green-500">Successful</span>
              ) : (
                <span className="text-yellow-500">Pending</span>
              )}
            </p>
          </div>
        ) : (
          <p>No user data available.</p>
        )}
        <div className=" justify-between flex flex-col md:flex-row gap-2  items-start md:items-center mt-2">
          <Button className=" bg-slate-500 text-white text-sm hover:bg-slate-600">Delete account</Button>
          <Button className=" bg-slate-500 text-white text-sm hover:bg-slate-600" onClick={handleSignOut }>Sign Out</Button>
        </div>
      </div>
      <div className=" sm:max-w-xl  mt-5 mx-auto py-4 px-8 border rounded shadow">
        <h4 className="font-semibold text-lg">varify yourself to get rewards</h4>
        <div className="flex mt-2 flex-col md:flex-row gap-2  items-start md:items-center justify-between ">
          <h4 className="text-md">Varify by email </h4>
          <div className="">
            <Button onClick={handleSendOtp} className="w-[150px]  bg-slate-500 text-white text-sm hover:bg-slate-600">
              Send Otp
            </Button>
          </div>
        </div>
        <div className="flex mt-2 flex-col md:flex-row gap-2  items-start md:items-center justify-between ">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "200px",
              outline: "none",
            }}
          />
          <Button className="w-[150px] border  bg-slate-500 text-white text-sm hover:bg-slate-600" onClick={handleVerifyOtp}>
            Varify Otp
          </Button>
        </div>
      </div>

      <div className="sm:max-w-xl  mt-5 mx-auto  py-4 px-8 border rounded shadow">
        <Button className=" bg-slate-500 text-white text-sm hover:bg-slate-600" onClick={handleFetchRefrals}>Referals</Button>
        <div className="w-full">
          {referredUsers.map((data, index) =>(
            <div className="">{data.name}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
