import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AdminNavBar from "./AdminNavBar";
import axiosInstance from "@/lib/axiosInstance";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifiedUsers, setVerifiedUsers] = useState([]); // Verified users
  const [unverifiedUsers, setUnverifiedUsers] = useState([]); // Unverified users
  const [searchTerm, setSearchTerm] = useState("");
  // const [filterUsers, setFilterUsers] = useState([])
  // const successfulUsers = []
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
     
      try {
        const response = await axiosInstance.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },  
        });

      

        if (response.status === 200) {
          setUsers(response.data.data);
          setAllUsers(response.data.data);
          filterVerifiedUsers(response.data.data); // Filter verified users
          filterUnverifiedUsers(response.data.data); // Filter unverified users
        } else {
          setError(response.data.message || "Failed to load users");
          
        }
      } catch (err) {
        setError("Failed to load users");
      
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const filterVerifiedUsers = (users) => {
    const verified = users.filter((user) => user.isVerified === true);
    setVerifiedUsers(verified);
  };

  const filterUnverifiedUsers = (users) => {
    const unverified = users.filter((user) => user.isVerified === false);
    setUnverifiedUsers(unverified);
  };

  const handleFilter = (statusType) => {
    if (statusType === "verified") {
      setUsers(verifiedUsers);
    } else if (statusType === "unverified") {
      setUsers(unverifiedUsers);
    }
  };
  // Search function to filter users by name or email
  const handleSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setSearchTerm(searchQuery);

    if (searchQuery === "") {
      // If the search query is empty, reset to the full list of users
      setUsers(allUsers);
    } else {
      // Filter the users based on search term
      const filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery) ||
          user.email.toLowerCase().includes(searchQuery)
      );
      setUsers(filteredUsers); // Update users with filtered results
    }
  };

  const deleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axiosInstance.delete(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Remove the deleted user from the list
        setUsers(users.filter(user => user._id !== userId));
        alert("user deletd succesfully")
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  
  return (
    <div className="">
      <AdminNavBar />

      <div className="mt-24 mx-20">
        <span className="text-sm sm:text-md font-semibold md:text-lg lg:text-xl  px-2   py-2 border-b-2 ">
          Dashboard
        </span>
      </div>
      <div className="mx-20 mt-10  ">
        <div className="table-container mb-10">
          <Tabs defaultValue="account">
            <TabsList className="flex text-lg   py-1 items-center justify-center">
              <TabsTrigger value="account">
                <span className="  text-lg font-semibold">Users</span>
              </TabsTrigger>
              <TabsTrigger value="password">
                <span className=" text-lg font-semibold">Referals</span>
              </TabsTrigger>
            </TabsList>

            {/* <div className="flex text-lg my-1 py-1 items-center justify-center">
              <span className="border-b-2 py-2 font-semibold">Users</span>
            </div> */}
            <div className="justify-between flex gap-2  py-2">
              <input
                type="text"
                onChange={handleSearch}
                placeholder="search..."
                className="border-2 outline-none  px-2 py-1 w-[300px]"
              />
              <div className="flex gap-2 ">
                <button
                  className="px-2 py-1 bg-gray-500 text-white"
                  onClick={() => setUsers(allUsers)}
                >
                  All
                </button>
                {/* onClick={handlefilter("successful")} */}
                <button
                  className="px-2 py-1 bg-gray-500 text-white"
                  onClick={() => handleFilter("verified")}
                >
                  Successsful
                </button>
                <button
                  className="px-2 py-1 bg-gray-500 text-white"
                  onClick={() => handleFilter("unverified")}
                >
                  {/* onClick={handlefilter("pending")} */}
                  Pending
                </button>
              </div>
            </div>
            
            <TabsContent value="account" >
              <Table style={{ borderCollapse: "collapse", width: "100%" }}>
                <TableCaption>A list of all Users</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-1 border border-gray-300">
                      {" "}
                      S.No.
                    </TableHead>
                    <TableHead className="px-4 py-1 border border-gray-300">
                      Name
                    </TableHead>
                    <TableHead className="px-4 py-1 border border-gray-300">
                      Email
                    </TableHead>
                    <TableHead className="px-4 py-1 border border-gray-300">
                      Referal Code
                    </TableHead>
                    <TableHead className="px-4 py-1 border border-gray-300">
                      Referal Status
                    </TableHead>
                    <TableHead className="px-4 py-1 border border-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((data, index) => (
                    <TableRow key={data._id} className=" m-6 ">
                      <TableCell className="px-4 py-1 border border-gray-300">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-1 border border-gray-300">
                        {data.name}
                      </TableCell>
                      <TableCell className="px-4 py-1 border border-gray-300">
                        {data.email}
                      </TableCell>
                      <TableCell className="px-4 py-1 border border-gray-300">
                        {data.referralCode}
                      </TableCell>
                      <TableCell className="px-4 py-1 border border-gray-300">
                        {data.isVerified == true ? (
                          <span className="text-green-400">Successful</span>
                        ) : (
                          <span className="text-red-500">Pending</span>
                        )}
                      </TableCell>
                      <TableCell className="flex gap-4 items-center py-2 px-4  border border-gray-300">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div>
                                <RiDeleteBin6Line
                                  size={20}
                                  className="text-red-400"
                                  onClick={() => deleteUser(data._id)}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-red-500">Delete User</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {/* <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Link to={`/dashboard-user/${data._id}`}>
                                <div>
                                  <FaRegUser size={15} className="" />
                                </div>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="">View User</div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="password">
              <Table style={{ borderCollapse: "collapse", width: "100%" }}>
                <TableCaption>A list of all Referals</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-4 py-1 border border-gray-300">
                      {" "}
                      S.No.
                    </TableHead>
                    <TableHead className="px-4 py-1 border border-gray-300">
                      Name
                    </TableHead>
                    <TableHead className="px-4 py-1 border border-gray-300">
                      Rewards
                    </TableHead>
                    <TableHead className="px-4 py-1 border border-gray-300">
                      Referee's
                    </TableHead>
                    {/* <TableHead className="px-4 py-1 border border-gray-300">
                      
                    </TableHead> */}
                    {/* <TableHead className="px-4 py-1 border border-gray-300">
                      Actions
                    </TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((data, index) => (
                    <TableRow key={data._id} className=" m-6 ">
                      <TableCell className="px-4 py-1 border border-gray-300">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-1 border border-gray-300">
                        {data.name}
                      </TableCell>
                      <TableCell className="px-4 py-1 border border-gray-300">
                        {data.rewards}
                      </TableCell>
                      <TableCell className="px-4 py-1 border border-gray-300">
                        {data.referrals &&
                        Array.isArray(data.referrals) &&
                        data.referrals.length > 0 ? (
                          data.referrals.map((referral, index) => (
                            <span key={index}>
                              {/* Check if the referral object and refereeName exist */}
                              {referral && referral.refereeName
                                ? referral.refereeName
                                : "Unknown"},
                                <span className="ml-2"></span>
                            </span>
                          ))
                        ) : (
                          <div>No referrals</div>
                        )}
                      </TableCell>
                      {/* <TableCell className="px-4 py-1 border border-gray-300">
                        {data.isVerified == true ? (
                          <span className="text-green-400">Successful</span>
                        ) : (
                          <span className="text-red-500">Pending</span>
                        )}
                      </TableCell> */}
                      {/* <TableCell className="flex gap-4 items-center py-2 px-4  border border-gray-300">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div>
                                <RiDeleteBin6Line
                                  size={20}
                                  className="text-red-400"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-red-500">Delete User</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Link to={`/dashboard-user/${data._id}`}>
                                <div>
                                  <FaRegUser size={15} className="" />
                                </div>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="">View User</div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
