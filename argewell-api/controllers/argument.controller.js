const Argument = require('../models/argument.model');

// @desc    Create a new argument draft
// @route   POST /api/arguments
// @access  Private
const createArgument = async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ message: 'Topic is required' });
    }

    try {
        const argument = new Argument({
            userId: req.user._id,
            topic,
            claim: '', // Start with an empty claim as a draft
        });

        const createdArgument = await argument.save();
        res.status(201).json({
            argumentId: createdArgument._id,
            topic: createdArgument.topic,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all arguments for the logged-in user
// @route   GET /api/arguments
// @access  Private
const getArguments = async (req, res) => {
    try {
        // As per spec, return a list of arguments for their library
        const args = await Argument.find({ userId: req.user._id })
            .select('topic updatedAt')
            .sort({ updatedAt: -1 });

        // The spec shows argumentId, so let's map it for consistency
        const response = args.map(a => ({
            argumentId: a._id,
            topic: a.topic,
            updatedAt: a.updatedAt
        }));

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single argument by ID
// @route   GET /api/arguments/:id
// @access  Private
const getArgumentById = async (req, res) => {
    try {
        const argument = await Argument.findById(req.params.id);

        if (!argument) {
            return res.status(404).json({ message: 'Argument not found' });
        }

        if (argument.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this argument' });
        }

        res.json(argument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update an argument's text
// @route   PUT /api/arguments/:id
// @access  Private
const updateArgument = async (req, res) => {
    const { claim, reason, evidence, impact } = req.body;

    try {
        const argument = await Argument.findById(req.params.id);

        if (!argument) {
            return res.status(404).json({ message: 'Argument not found' });
        }

        if (argument.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this argument' });
        }

        // Update fields that are provided in the body
        if (claim) argument.claim = claim;
        if (reason) argument.reason = reason;
        if (evidence) argument.evidence = evidence;
        if (impact) argument.impact = impact;

        const updatedArgument = await argument.save();
        res.json(updatedArgument);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createArgument,
    getArguments,
    getArgumentById,
    updateArgument,
};
