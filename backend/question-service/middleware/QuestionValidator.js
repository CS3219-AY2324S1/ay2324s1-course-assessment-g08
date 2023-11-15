const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');

const validateQuestion = () => {
    return [
        body('title')
            .notEmpty().withMessage("Title is required")
            .custom(async value => {
                if (await Question.findOne({ title: value })) {
                    throw new Error('Question with this title already exists')
                }
            }),
        body('categories')
            .isLength({ min: 1 })
            .withMessage("Category array cannot be empty"),
        body('complexity').isIn(['Easy', 'Medium', 'Hard']).withMessage("Invalid complexity"),
        body('description')
            .notEmpty().withMessage('Description is required')
            .custom(async value => {
                if (await Question.findOne({ description: value })) {
                    throw new Error('Question with this description already exists')
                }
            }),
        body('outputs')
            .isArray()
            .withMessage("Outputs must be an array"),
        body('inputs')
            .isArray()
            .withMessage('Inputs must be an array')
            .custom((value, { req }) => {
                if (req.body.outputs && value && value.length !== req.body.outputs.length) {
                    throw new Error('Inputs and Outputs must have the same length');
                }

                if (value && !value.every(item => typeof item === 'object' && item !== null && Object.keys(item).length === Object.keys(value[0]).length)) {
                    throw new Error('All elements in the "inputs" array must be objects with the same number of key-value pairs');
                }
        
                if (value && !value.every(item => Object.keys(item).length > 0)) {
                    throw new Error('All objects in the "inputs" array must have at least one key-value pair');
                }

                return true;
            }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                errorMessage = errors.array().map(err => err.msg).join(", ");
                return res.status(400).json({ msg: errorMessage });
            }

            next();
        }
    ];
};

const validateUpdateQuestion = () => {
    return [
        body('title')
            .notEmpty().withMessage("Title is required")
            .custom(async (value, { req }) => {
                const question = await Question.findOne({ title: value });
                if (question && question._id.toString() !== req.body.questionId) {
                    throw new Error('Question with this title already exists')
                }
            }),
        body('categories')
            .isLength({ min: 1 })
            .withMessage("Category array cannot be empty"),
        body('complexity').isIn(['Easy', 'Medium', 'Hard']).withMessage("Invalid complexity"),
        body('description')
            .notEmpty().withMessage('Description is required')
            .custom(async (value, { req }) => {
                const question = await Question.findOne({ description: value });
                if (question && question._id.toString() !== req.body.questionId) {
                    throw new Error('Question with this description already exists')
                }
            }),
        body('outputs')
            .isArray()
            .withMessage("Outputs must be an array"),
        body('inputs')
            .isArray()
            .withMessage('Inputs must be an array')
            .custom((value, { req }) => {
                if (req.body.outputs && value && value.length !== req.body.outputs.length) {
                    throw new Error('Inputs and Outputs must have the same length');
                }

                if (value && !value.every(item => typeof item === 'object' && item !== null && Object.keys(item).length === Object.keys(value[0]).length)) {
                    throw new Error('All elements in the "inputs" array must be objects with the same number of key-value pairs');
                }
        
                if (value && !value.every(item => Object.keys(item).length > 0)) {
                    throw new Error('All objects in the "inputs" array must have at least one key-value pair');
                }

                return true;
            }),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                errorMessage = errors.array().map(err => err.msg).join(", ");
                return res.status(400).json({ msg: errorMessage });
            }

            next();
        }
    ];
};

module.exports = {
    validateQuestion,
    validateUpdateQuestion
};