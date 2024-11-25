import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-3 md:px-6 lg:px-8 py-3  bg-slate-500">
      <div className="text-white text-lg sm:text-xl  md:text-2xl font-semibold">
        Referly
      </div>
      <div className="flex gap-2">
        <Link to={"/sign-in"}>
          <Button className="bg-white text-md sm:text-lg px-2 py-1 sm:px-4 sm:py-2  text-slate-500">
            login
          </Button>
        </Link>
        <Link to={"/sign-up"}>
          <Button className="bg-white text-md sm:text-lg px-2 py-1 sm:px-4 sm:py-2 text-slate-500">
            sign up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
