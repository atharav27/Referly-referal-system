// import User from "../models/user.modal.js"; // Adjust path as needed
// // import bcryptjs from "bcryptjs";

// export const getProfile = async (req, res ) => {
//   try {
//     const { userId } = req.params;

//     // Ensure the userId in the token matches the requested userId
//     if (req.user.userId !== userId) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Access denied." });
//     }

//     // Find user excluding the password
//     const user = await User.findById(userId, "-password");
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found." });
//     }

//     // Respond with user data
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Server error. Please try again." });
//   }
// };

import User from "../models/User.js"; // Assuming your user model is stored in this path

export const getProfile = async (req, res) => {
  try {
    // Extract userId from the decoded token (from the middleware)
    const userId = req.user.id; 

    // Fetch user data from the database
    const user = await User.findById(userId).select("-password"); // Exclude password field for security

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Send user data as response
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

