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

        // Fetch referee data and handle missing referee gracefully
        const refereeDetails = await Promise.all(
          referrals.map(async (ref) => {
            // Check if the refereeId is valid
            if (!ref.refereeId) {
              return null; // Skip this referral if refereeId is missing
            }

            // Fetch the referee user based on the refereeId
            const referee = await User.findById(
              ref.refereeId,
              "name email isVerified rewards"
            );

            // Check if referee exists
            if (!referee) {
              console.warn(`No referee found for referral: ${ref._id}`);
              return null; // Return null if referee is not found
            }

            // Return the referee's details along with the referral data
            return {
              refereeId: ref.refereeId,
              refereeName: referee.name,
              refereeEmail: referee.email,
              refereeIsVerified: referee.isVerified,
              refereeRewards: referee.rewards,
              status: ref.status,
              createdAt: ref.createdAt,
            };
          })
        );
        // Return the user data along with referral score and details
        return {
          ...user.toObject(), // Convert user document to plain object
          referralScore,
          referrals: refereeDetails,
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



export const getAdmins = async (req, res, next) => {
  try {
    // Query to find users with role "admin"
    const admins = await User.find(
      { role: "admin" },
      "name email role createdAt"
    );

    if (!admins || admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No admins found",
      });
    }

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    // Pass the error to the error handler middleware
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;  // Get the user ID from the request params

    // Query to find the user by ID
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Return success response
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    // Pass the error to the error handler middleware
    next(error);
  }
};

//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (response.status === 200) {
//       // Remove the deleted user from the UI
//       setUsers(users.filter((user) => user._id !== userId));
//     }
//   } catch (err) {
//     console.error("Failed to delete user", err);
//   }
// };