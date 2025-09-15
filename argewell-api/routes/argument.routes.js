const express = require('express');
const router = express.Router();
const {
    createArgument,
    getArguments,
    getArgumentById,
    updateArgument,
} = require('../controllers/argument.controller');
const requireAuth = require('../middleware/requireAuth');

/**
 * @swagger
 * tags:
 *   name: Arguments
 *   description: API for managing user arguments. All endpoints require authentication.
 */

// Protect all routes in this file
router.use(requireAuth);

/**
 * @swagger
 * /arguments:
 *   post:
 *     summary: Create a new argument draft
 *     tags: [Arguments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "The case for Universal Basic Income"
 *     responses:
 *       201:
 *         description: Argument draft created successfully.
 *       401:
 *         description: Unauthorized (invalid or missing token).
 */
router.post('/', createArgument);

/**
 * @swagger
 * /arguments:
 *   get:
 *     summary: Get all arguments for the logged-in user
 *     tags: [Arguments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's arguments (summary view).
 *       401:
 *         description: Unauthorized (invalid or missing token).
 */
router.get('/', getArguments);

/**
 * @swagger
 * /arguments/{id}:
 *   get:
 *     summary: Get a single argument by ID
 *     tags: [Arguments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The argument ID (e.g., 60c72b2f9b1d8c001f8e4a3a).
 *     responses:
 *       200:
 *         description: The full argument object, including analysis history.
 *       401:
 *         description: Unauthorized (user does not own this argument).
 *       404:
 *         description: Argument not found.
 */
router.get('/:id', getArgumentById);

/**
 * @swagger
 * /arguments/{id}:
 *   put:
 *     summary: Update an argument's text fields
 *     tags: [Arguments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The argument ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               claim:
 *                 type: string
 *                 example: "UBI would stimulate the economy."
 *               reason:
 *                 type: string
 *                 example: "It provides a stable floor for consumer spending."
 *               evidence:
 *                 type: string
 *                 example: "Studies from the anita experiment showed..."
 *               impact:
 *                 type: string
 *                 example: "This would lead to more resilient local businesses."
 *     responses:
 *       200:
 *         description: The updated argument object.
 *       401:
 *         description: Unauthorized (user does not own this argument).
 *       404:
 *         description: Argument not found.
 */
router.put('/:id', updateArgument);

module.exports = router;
