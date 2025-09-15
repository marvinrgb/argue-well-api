const express = require('express');
const router = express.Router();
const {
    analyzeArgumentController,
    devilsAdvocateController
} = require('../controllers/coach.controller');
const requireAuth = require('../middleware/requireAuth');
const checkUsageLimits = require('../middleware/checkUsageLimits');

// Protect all coach routes
router.use(requireAuth);

// @route    POST /api/coach/analyze/:argumentId
// @desc     Run an argument through the AI coach for analysis
// @access   Private
router.post('/analyze/:argumentId', checkUsageLimits, analyzeArgumentController);

// @route    POST /api/coach/devils-advocate/:argumentId
// @desc     Generate counter-arguments for a user's claim
// @access   Private
router.post('/devils-advocate/:argumentId', devilsAdvocateController);

module.exports = router;
