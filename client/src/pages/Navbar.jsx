import React, { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/authContext";

const Navbar = () => {
  const { login, logout, isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    // Check if a token exists in local storage or cookies
    const storedToken = localStorage.getItem("token"); // Change this to your token name
    
    if (storedToken) {
      // Validate the token (e.g., verify its signature on the server)
      // If the token is valid, log the user in with the token
      login(storedToken);
    } else {
      // No token found; the user is not authenticated
      logout();
    }
  }, [isAuthenticated]);
  return (
    <div className="flex justify-between items-center px-3 md:px-6 lg:px-8 py-3  bg-slate-500">
      <div className="text-white text-lg sm:text-xl  md:text-2xl font-semibold">
        Referly
      </div>
      {!isAuthenticated ? (
        <div className="flex gap-2">
          <Link to={"/sign-in"}>
            <Button className="bg-gray-100 hover:bg-white text-md sm:text-lg px-2 py-1 sm:px-4 sm:py-2  text-slate-500">
              Login
            </Button>
          </Link>
          <Link to={"/"}>
            <Button className="bg-gray-100 hover:bg-white text-md sm:text-lg px-2 py-1 sm:px-4 sm:py-2 text-slate-500">
              Sign up
            </Button>
          </Link>
        </div>
      ) : <div className="flex text-white  gap-3">
        <div className="">Home</div>
        <div className="">About</div>
        Contact</div>}
    </div>
  );
};

export default Navbar;