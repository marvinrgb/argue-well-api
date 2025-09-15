const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // Will be a bcrypt hash
    subscriptionTier: { type: String, enum: ['free', 'pro'], default: 'free' },
    monthlyAnalysisCount: { type: Number, default: 0 },
    lastAnalysisDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
