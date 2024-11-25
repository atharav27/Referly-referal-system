import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refereeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Successful'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Referral', referralSchema);
