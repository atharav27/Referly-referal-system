import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tableData = [
  { id: 1, name: "John Doe", age: 28, occupation: "Engineer" },
  { id: 2, name: "Jane Smith", age: 34, occupation: "Designer" },
  { id: 3, name: "Sam Wilson", age: 25, occupation: "Developer" },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterUsers, setFilterUsers] = useState([])
  const successfulUsers = []
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      // console.log(token)
      try {
        const response = await axios.get("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(response.data, "jfgsdrg");

        if (response.status === 200) {
          setUsers(response.data.data); // Set the fetched users with referral data
        } else {
          setError(response.data.message || "Failed to load users");
          // console.log(error,"atah")
        }
      } catch (err) {
        setError("Failed to load users");
        // console.log(err, "ohg")
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

//   const handlefilter = (statusType) => {
// if(statusType === "successful"){
//   // users?.map((user) => user.isVerified === "true" && successfulUsers.push(user)) 
//   // setFilterUsers(successfulUsers)
//   const data = users.filter((user) => user.isVerified === true)
//   setFilterUsers
// }
//   }

  console.log(users);
  return (
    <div className="">
      <div className="w-full py-3 px-10 flex justify-between bg-gray-500">
        <h1 className="text-lg  md:text-xl lg:text-3xl font-bold text-white text-start">
          <Link to={"/admin-dashboard"}> Referly</Link>
        </h1>
        <div className="flex gap-2 items-end">
          <div className="">
            <IoIosNotificationsOutline size={30} />
          </div>
          <div className=" ">
            <FaUser size={30} className="text-gray-200" />
          </div>
          <div className="text-sm sm:text-md  md:text-lg text-gray-200 border-b-2">
            Admin name
          </div>
        </div>

        {/* <div className=" px-2 sm:px-4">
          <h1>Users</h1>
          <h1>Users</h1>
        </div> */}
      </div>
      <div className="mt-8 mx-20">
        <span className="text-sm sm:text-md font-semibold md:text-lg lg:text-xl  px-2   py-2 border-b-2 ">
          Dashboard
        </span>
      </div>
      <div className="mx-20 mt-10  ">
        <div className="table-container">
          <div className="flex text-lg my-1 py-1 items-center justify-center">
            <span className="border-b-2 py-2 font-semibold">Users</span>
          </div>
          <div className="justify-between flex gap-2  py-2">
          <input type="text" placeholder="search..." className="border-2 outline-none  px-2 py-1 w-[300px]" />
            <div className="flex gap-2 ">
              {/* onClick={handlefilter("successful")} */}
              <button className="px-2 py-1 bg-gray-500 text-white" >
                Successsful
              </button>
              <button className="px-2 py-1 bg-gray-500 text-white" >
              {/* onClick={handlefilter("pending")} */}
                Pending
              </button>
            </div>
          </div>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead className="">
              <tr className="bg-[#f4f4f4] ">
                <th>S.No.</th>
                <th className="text-start">Name</th>
                <th className="text-start">Email</th>
                <th className="text-start">Referal Code</th>
                <th className="text-start">Referal Status</th>
                <th className="text-start">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((data, index) => (
                <tr key={index} className="border-2 m-6 ">
                  <td className="">{index + 1}</td>

                  <td className="">{data.name}</td>
                  <td>{data.email}</td>
                  <td>{data.referralCode}</td>
                  <td>
                    {data.isVerified == true ? (
                      <span className="text-green-400">Successful</span>
                    ) : (
                      <span className="text-red-500">Pending</span>
                    )}
                  </td>
                  <td className="flex gap-4 items-center py-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <button>
                            <RiDeleteBin6Line
                              size={20}
                              className="text-red-400"
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-red-500">Delete User</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <button>
                            <FaRegUser size={15} className="" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="">View User</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
