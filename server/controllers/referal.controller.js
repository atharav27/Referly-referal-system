import Referral from "../models/referal.model.js";
import User from "../models/user.modal.js";

export const getReferredUsers = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find referrals where the user is the referrer
    const referrals = await Referral.find({ referrerId: userId }).populate(
      "refereeId",
      "name email rewards isVerified"
    );

    // Extract the referred user details
    const referredUsers = referrals.map((ref) => {
      if (ref.refereeId) {
        return {
          id: ref.refereeId._id,
          name: ref.refereeId.name,
          email: ref.refereeId.email,
          rewards: ref.refereeId.rewards,
          isVerified: ref.refereeId.isVerified,
          createdAt: ref.createdAt,
        };
      }
      return null; // Return null if there's no valid refereeId
    }).filter(ref => ref !== null); // Remove null values

    res.status(200).json({ success: true, data: referredUsers });
  } catch (error) {
    next(error);
  }
};

// import User from "../models/User.js";

export const getReferralDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Fetch user details
    const user = await User.findById(userId, "referralCode rewards");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode,
        rewards: user.rewards,
      },
    });
  } catch (error) {
    next(error);
  }
};
