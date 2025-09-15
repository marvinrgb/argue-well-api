const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
    fallacies: [{
        name: String,       // e.g., "Ad Hominem"
        explanation: String // "Your argument attacks the person, not their point."
    }],
    clarityScore: { type: Number, min: 0, max: 100 }, // A score of 0-100
    evidenceFeedback: String,
    concisenessFeedback: String,
    createdAt: { type: Date, default: Date.now }
});

const argumentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    claim: { type: String, required: true },
    reason: { type: String },
    evidence: { type: String },
    impact: { type: String },
    analysisHistory: [analysisSchema] // Stores a log of each AI analysis run
}, { timestamps: true });

module.exports = mongoose.model('Argument', argumentSchema);
