module.exports = async (req, res, next) => {
    const { user } = req;
    const now = new Date();

    // Logic to reset count if it's a new month
    if (user.lastAnalysisDate) {
        const lastAnalysisMonth = user.lastAnalysisDate.getMonth();
        const currentMonth = now.getMonth();
        const lastAnalysisYear = user.lastAnalysisDate.getFullYear();
        const currentYear = now.getFullYear();

        if (currentYear > lastAnalysisYear || (currentYear === lastAnalysisYear && currentMonth > lastAnalysisMonth)) {
            user.monthlyAnalysisCount = 0;
            // The updated count will be saved in the controller after the analysis is complete.
        }
    }

    if (user.subscriptionTier === 'free' && user.monthlyAnalysisCount >= 5) {
        return res.status(429).send({
            error: 'You have exceeded your monthly analysis limit of 5 analyses. Please upgrade to Pro for unlimited analyses.'
        });
    }

    next();
};
