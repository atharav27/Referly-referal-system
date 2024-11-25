import bcryptjs from "bcryptjs";
import User from "../models/user.modal.js"; // Adjust path as needed
import { generateReferralCode } from "../utility/referalCode.js"; // Utility for referral code generation
import Referral from "../models/referal.model.js"; // Model for storing referral relationships
import jwt from "jsonwebtoken";
// import { errorHandler } from "../utility/error.js";

export const signup = async (req, res, next) => {
  const { name, email, password, referralCode } = req.body;
  // Validate input fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered" });
    }

    // Generate a referral code for the new user
    const newReferralCode = generateReferralCode();

    // Hash the password before saving
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // If the user provided a referral code, associate them with the referrer
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      if (referrer) {
        // Create a referral tracking record
        const referral = new Referral({
          referrerId: referrer._id,
          refereeId: savedUser._id,
          status: "Pending", // Initially, the referral is pending until profile verification
        });

        await referral.save();
      }
    }

    // Create a new user document
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      referralCode: newReferralCode, // Assign the generated referral code
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // If the user provided a referral code, associate them with the referrer
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      if (referrer) {
        // Create a referral tracking record
        const referral = new Referral({
          referrerId: referrer._id,
          refereeId: savedUser._id,
          status: "Pending", // Initially, the referral is pending until profile verification
        });

        await referral.save();
      }
    }

    // Send success response
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      referralCode: newReferralCode, // Optionally return the referral code
    });
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

// User Login in
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare entered password with the hashed password in the database
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "60d", // Token expires in 60 days
    });
    console.log("Generated Token:", token);
    // Respond with the token in the body (instead of setting a cookie)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token, // Send token directly in response
    });
  } catch (error) {
    next(error);
  }
};