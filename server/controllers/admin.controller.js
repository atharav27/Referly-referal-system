import User from "../models/user.modal.js";

export const getAllUsersForAdmin = async (req, res) => {
    try {
      const users = await User.find(
        {}, // No filter, fetch all users
        'name email referralCode isVerified rewards' // Select only the fields you need
      );
  
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message,
      });
    }
  };
  

  export const deleteUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete user', error });
    }
  };
  