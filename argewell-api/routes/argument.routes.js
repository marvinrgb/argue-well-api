const express = require('express');
const router = express.Router();
const {
    createArgument,
    getArguments,
    getArgumentById,
    updateArgument,
} = require('../controllers/argument.controller');
const requireAuth = require('../middleware/requireAuth');

// Protect all routes in this file
router.use(requireAuth);

// @route    POST api/arguments
// @desc     Create a new argument draft
// @access   Private
router.post('/', createArgument);

// @route    GET api/arguments
// @desc     Get all arguments for the logged-in user
// @access   Private
router.get('/', getArguments);

// @route    GET api/arguments/:id
// @desc     Get a single argument by ID
// @access   Private
router.get('/:id', getArgumentById);

// @route    PUT api/arguments/:id
// @desc     Update an argument's text
// @access   Private
router.put('/:id', updateArgument);

module.exports = router;
