const Argument = require('../models/argument.model');
const { analyzeArgument, generateCounterArguments } = require('../services/aiCoachService');

// @desc    Run an argument through the AI coach for analysis
// @route   POST /api/coach/analyze/:argumentId
// @access  Private
const analyzeArgumentController = async (req, res) => {
    const { textToAnalyze } = req.body;
    const { argumentId } = req.params;
    const user = req.user;

    if (!textToAnalyze) {
        return res.status(400).json({ message: 'Text to analyze cannot be empty.' });
    }

    try {
        const argument = await Argument.findById(argumentId);

        if (!argument) {
            return res.status(404).json({ message: 'Argument not found.' });
        }

        if (argument.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to analyze this argument.' });
        }

        // Call the AI service
        const analysisResult = await analyzeArgument(textToAnalyze);

        // Save the new analysis to the argument's history
        argument.analysisHistory.push(analysisResult);

        // If the user is on the free tier, increment their count and update the date
        if (user.subscriptionTier === 'free') {
            user.monthlyAnalysisCount += 1;
            user.lastAnalysisDate = new Date();
            await user.save();
        }

        await argument.save();

        // Return the newly created analysis
        res.status(200).json({ analysis: argument.analysisHistory[argument.analysisHistory.length - 1] });

    } catch (error) {
        console.error('AI Analysis Error:', error);
        // Check for JSON parsing errors from the AI service
        if (error instanceof SyntaxError) {
            return res.status(502).json({ message: 'Received an invalid response from the AI service. Please try again.' });
        }
        res.status(500).json({ message: 'Server error during argument analysis.' });
    }
};

// @desc    Generate counter-arguments
// @route   POST /api/coach/devils-advocate/:argumentId
// @access  Private
const devilsAdvocateController = async (req, res) => {
    const { textToChallenge } = req.body;

    if (!textToChallenge) {
        return res.status(400).json({ message: 'Text to challenge cannot be empty.' });
    }

    try {
        // The spec implies this is tied to an argument, but the body suggests it can be any text.
        // We will not require argument ownership here, just that the user is authenticated.
        const result = await generateCounterArguments(textToChallenge);
        res.status(200).json(result);

    } catch (error) {
        console.error('Devil\'s Advocate Error:', error);
        if (error instanceof SyntaxError) {
            return res.status(502).json({ message: 'Received an invalid response from the AI service. Please try again.' });
        }
        res.status(500).json({ message: 'Server error while generating counter-arguments.' });
    }
};

module.exports = {
    analyzeArgumentController,
    devilsAdvocateController,
};
