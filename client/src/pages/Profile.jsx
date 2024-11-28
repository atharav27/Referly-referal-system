import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext.jsx";
import axiosInstance from "@/lib/axiosInstance";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState();
  const [showOtpField, SetShowOtpField] = useState(false);
  const [referredUsers, setReferredUsers] = useState([]);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [referalTable ,setReferalTable] = useState(false)

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
    
        const userId = extractUserIdFromToken();
        
        
        // Make an API call to fetch user details
        const response = await axiosInstance.get(`/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
       
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
    
    try {
      const response = await axiosInstance.post("/auth/send-verification-otp", {
        email,
      });
    
      setMessage(response.data.message);
      alert(response.data.otp);
     
      SetShowOtpField(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP.");
    }
  };

  // varify otp
  const handleVerifyOtp = async () => {
    const email = user.email;

   
    try {
      const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
      setMessage(response.data.message);
      setOtp(""); // Clear the OTP field on success
      if (response.status == 200) {
        alert("OTP verified successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Error verifying OTP.");
    }
  };

  const handleFetchRefrals = async () => {
    

    const token = localStorage.getItem("token");
    const userId = extractUserIdFromToken(); // Extract userId from the token

 
    try {
      setLoading(true);
      const response = await axiosInstancestance.get(`/referal/referals/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
   
      setReferredUsers(response.data.data);
  
      setReferalTable(true)
    } catch (error) {
      console.log("Error:", error);
      setError(
        error.response?.data?.message || "Failed to fetch referred users."
      );
    } finally {
      setLoading(false);
    }
  };

  // const deleteAccount = async () => {
  //   try {
  //     const userId = extractUserIdFromToken();
  //     const response = await axios.delete(
  //       `/api/user/delete-profile/${userId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`, // Fix: Add a space between "Bearer" and the token
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  
  //     if (response.status === 200) {
  //       localStorage.removeItem("token"); // Clear the token
  //       logout(); // Log the user out (ensure this function is defined correctly)
  //       alert("User deleted successfully!");
  //       navigate("/"); // Redirect to the sign-up page or login page
  //     }
  //   } catch (err) {
  //     alert("Unable to delete user");
  //     console.log(err);
  //   }
  // };
  

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Clear the token
    logout();
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
        <Button
            className=" mt-2 bg-slate-500 text-white text-sm hover:bg-slate-600"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        {/* <div className=" justify-between flex flex-col md:flex-row gap-2  items-start md:items-center mt-2">
          <Button
            className=" bg-slate-500 text-white text-sm hover:bg-slate-600"
            onClick={deleteAccount}
          >
            Delete account
          </Button>
          
        </div> */}
      </div>
      <div className=" sm:max-w-xl  mt-5 mx-auto py-4 px-8 border rounded shadow">
        <h4 className="font-semibold text-lg">
          verify yourself to get rewards
        </h4>
        <div className="flex mt-2 flex-col md:flex-row gap-2  items-start md:items-center justify-between ">
          <h4 className="text-md">Verify by email </h4>
          <div className="">
            <Button
              onClick={handleSendOtp}
              className="w-[150px]  bg-slate-500 text-white text-sm hover:bg-slate-600"
            >
              Send OTP
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
          <Button
            className="w-[150px] border  bg-slate-500 text-white text-sm hover:bg-slate-600"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </Button>
        </div>
      </div>

      <div className="sm:max-w-xl  my-5 mx-auto  py-4 px-8 border rounded shadow">
        <Button
          className=" bg-slate-500 text-white text-sm hover:bg-slate-600"
          onClick={handleFetchRefrals}
        >
          Referals
        </Button>
        {referalTable === true ? <div className="w-full">
          {/* {referredUsers.map((data, index) => (
            <div className="">{data.name}</div>
          ))} */}
          <div className="overflow-x-auto my-5">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 border border-gray-300 text-left">
                    Name
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left">
                    Email
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left">
                    Referal Score
                  </th>
                  <th className="px-4 py-2 border border-gray-300 text-left">
                    Referal Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {referredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border border-gray-300">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.email}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.rewards}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {user.isVerified ? <span className="text-green-400">"successful"</span> :<span className="text-red-500"> pending</span>}
                    </td>
                    
                    {/* <td className="px-4 py-2 border border-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>: ""}
        
      </div>
    </div>
  );
};

export default ProfilePage;
