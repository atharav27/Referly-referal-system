import User from "../models/user.modal.js";

import Referral from "../models/referal.model.js";

export const getAllUsersForAdmin = async (req, res) => {
  try {
    
    const users = await User.find(
      { role: { $ne: "admin" } }, // Exclude users with the role 'admin'
      "name email referralCode isVerified rewards role" // Fields to return, including role for debugging
    );

    // For each user, fetch their referrals and calculate their referral score
    const usersWithReferrals = await Promise.all(
      users.map(async (user) => {
        // Fetch referrals where the user is the referrer
        const referrals = await Referral.find({ referrerId: user._id });

        // Calculate referral score (number of referrals)
        const referralScore = referrals.length;

        // Format referral details
        const referralDetails = referrals.map((ref) => ({
          refereeId: ref.refereeId,
          status: ref.status,
          createdAt: ref.createdAt,
        }));

        // Return the user data along with referral score and details
        return {
          ...user.toObject(), // Convert user document to plain object
          referralScore,
          referrals: referralDetails,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: usersWithReferrals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete user", error });
  }
};
