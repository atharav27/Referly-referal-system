import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { PiSignOut } from "react-icons/pi";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AuthContext } from "@/context/authContext";

const AdminNavBar = () => {
  const [admins, setAdmins] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const getAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/admin/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
     
        setAdmins(response.data.data);
      } catch (err) {
        console.error(
          "Failed to fetch admins:",
          err.response?.data?.message || err.message
        );
      }
    };

    getAdmins();
  }, []);
  const handleSignOut = () => {
    localStorage.removeItem("token"); // Clear the token
    logout();
    navigate("/sign-in"); 
  };
  return (
    <div>
      <div className="w-full py-3 px-10 flex fixed z-30 top-0 justify-between bg-gray-500">
        <h1 className="text-lg md:text-xl lg:text-3xl font-bold text-white text-start">
          <Link to={"/admin-dashboard"}>Referly</Link>
        </h1>
        <div className="flex gap-2 items-center">
          <div>
            {/* <IoIosNotificationsOutline size={30} /> */}
          </div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div>
                    <FaUser size={30} className="text-gray-200  " />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="">Admin</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-sm sm:text-md md:text-lg text-gray-200 border-b-2">
            {admins[0]?.name || "No Admin"}
          </div>
          <div className="">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <PiSignOut  size={30} className=" text-base text-white" onClick={handleSignOut}/>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="">Sign Out</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavBar;
