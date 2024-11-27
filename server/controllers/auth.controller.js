import bcryptjs from "bcryptjs";
import User from "../models/user.modal.js"; // Adjust path as needed
import { generateReferralCode } from "../utility/referalCode.js"; // Utility for referral code generation
import Referral from "../models/referal.model.js"; // Model for storing referral relationships
import jwt from "jsonwebtoken";
// import crypto from "crypto";
import nodemailer from "nodemailer";
// import { sendOTP } from "../utility/mailer.js";
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
          refereeId: savedUser._id, // Use `savedUser._id` here after saving
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
        .json({ success: false, message: "Invalid email or password" });
    }

    // Check if the user is an admin
    if (user.role === "admin") {
      // Handle admin login
      const adminToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "60d" }
      );

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        token: adminToken,
        role: user.role, // Optional: Include role for frontend use
      });
    }

    // Handle non-admin login (regular user)
    const userToken = jwt.sign(
      { id: user._id, role: user.role },
      // { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "60d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: userToken,
      role: user.role, // Optional: Include role for frontend use
    });
  } catch (error) {
    next(error);
  }
};

// Example of OTP generation and sending logic
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
};

// send varification otp
export const sendVerificationOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP(); // Generate OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    // Saveing  OTP and expiry to the user model
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // let testAccount = await nodemailer.createTestAccount();
    // connect with smtp
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "felipa.hartmann@ethereal.email",
        pass: "7ZJAHrBGKnAje7ubGb",
      },
    });

    const info = await transporter.sendMail({
      from: '"Your App Name" <felipa.hartmann@ethereal.email>', // Sender address
      to: email, // Recipient's email address
      subject: "OTP for Email Verification", // Email subject
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`, // Plain text body
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h3>Welcome to Your App!</h3>
          <p>Here is your OTP for email verification:</p>
          <p style="font-size: 1.5em; font-weight: bold; color: #4CAF50;">${otp}</p>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `, // HTML body
    });

    // console.log("OTP email sent: %s", info.messageId);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
      ...(process.env.NODE_ENV !== "production" && { otp }), // Include OTP in response for testing
    });
  } catch (error) {
    // console.error("Error sending OTP:", error.message);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check if OTP is valid
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // Check if OTP has expired
    if (Date.now() > user.otpExpiry) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired." });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null; // Clear OTP after verification
    user.otpExpiry = null; // Clear OTP expiry time
    await user.save();

    // Update referral status and scores
    const referral = await Referral.findOne({
      refereeId: user._id,
      status: "Pending",
    });

    if (referral) {
      const referrer = await User.findById(referral.referrerId);

      if (referrer) {
        const scoreIncrementForReferrer = 100; // Example: Add 10 points to the referrer
        const scoreIncrementForReferee = 50; // Example: Add 5 points to the referee

        // Update scores
        referrer.rewards += scoreIncrementForReferrer;
        await referrer.save();

        user.rewards += scoreIncrementForReferee;
        await user.save();

        // Update referral status to "Successful"
        referral.status = "Successful";
        await referral.save();
      }
    }

    // Optionally, update referral status
    await Referral.updateMany(
      { refereeId: user._id, status: "pending" },
      { status: "successful" }
    );

    // // Optionally, update referral status
    // const updatedReferrals = await Referral.updateMany(
    //   { refereeId: user._id, status: "pending" },
    //   { status: "successful" }
    // );

    res
      .status(200)
      .json({ success: true, message: "User verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again.",
    });
  }
};
