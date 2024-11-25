import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashed password
  referralCode: { type: String, unique: true }, // Generated code for referrals
  isVerified: { type: Boolean, default: false }, // Tracks profile verification
  rewards: { type: Number, default: 0 }, // Optional for referral rewards
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
