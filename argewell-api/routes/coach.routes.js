const express = require('express');
const router = express.Router();
const {
    analyzeArgumentController,
    devilsAdvocateController
} = require('../controllers/coach.controller');
const requireAuth = require('../middleware/requireAuth');
const checkUsageLimits = require('../middleware/checkUsageLimits');

/**
 * @swagger
 * tags:
 *   name: AI Coach
 *   description: Endpoints for AI-powered argument analysis and feedback. Requires authentication.
 */

// Protect all coach routes
router.use(requireAuth);

/**
 * @swagger
 * /coach/analyze/{argumentId}:
 *   post:
 *     summary: Run an argument through the AI coach for analysis
 *     tags: [AI Coach]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: argumentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the argument to analyze.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - textToAnalyze
 *             properties:
 *               textToAnalyze:
 *                 type: string
 *                 description: The full text of the user's argument to be analyzed.
 *                 example: "The earth is flat because when I look outside, it appears flat. Any evidence to the contrary is a conspiracy."
 *     responses:
 *       200:
 *         description: Analysis complete. Returns the new analysis object which has been saved to the argument's history.
 *       401:
 *         description: Unauthorized (invalid token or user does not own the argument).
 *       404:
 *         description: Argument not found.
 *       429:
 *         description: Monthly analysis limit exceeded for free tier.
 *       502:
 *         description: Invalid response from the AI service.
 */
router.post('/analyze/:argumentId', checkUsageLimits, analyzeArgumentController);

/**
 * @swagger
 * /coach/devils-advocate/{argumentId}:
 *   post:
 *     summary: Generate counter-arguments for a user's claim
 *     tags: [AI Coach]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: argumentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the argument being challenged (used for context, though not for ownership check).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - textToChallenge
 *             properties:
 *               textToChallenge:
 *                 type: string
 *                 description: The user's core claim or full argument to challenge.
 *                 example: "Pineapple belongs on pizza."
 *     responses:
 *       200:
 *         description: A list of counter-arguments.
 *       401:
 *         description: Unauthorized (invalid or missing token).
 *       502:
 *         description: Invalid response from the AI service.
 */
router.post('/devils-advocate/:argumentId', devilsAdvocateController);

module.exports = router;
