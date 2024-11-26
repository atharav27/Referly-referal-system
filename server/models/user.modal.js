import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  referralCode: { type: String, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Adding role
  isVerified: { type: Boolean, default: false },
  otp: { type: String }, // OTP field
  otpExpiry: { type: Date }, // OTP expiry time
  rewards: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
