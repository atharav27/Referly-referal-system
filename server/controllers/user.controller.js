import User from "../models/user.modal.js"; // Adjust path as needed
// import bcryptjs from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure the userId in the token matches the requested userId
    // if (req.user.userId !== userId) {
    //   return res
    //     .status(403)
    //     .json({ success: false, message: "Access denied." });
    // }

    // Find user excluding the password
    const user = await User.findById(userId, "-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Respond with user data
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};
export const deleteUser = async (req, res) => {
  const { id } = req.params; // Extract user ID from the request params

  try {
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};