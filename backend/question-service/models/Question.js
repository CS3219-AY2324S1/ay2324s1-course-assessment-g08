const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const questionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    categories: [
        {
            type: String,
            required: true
        }
    ],
    complexity: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    codeTemplate: {
        type: Schema.Types.ObjectId,
        ref: 'CodeTemplate'
    },
    testCases: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TestCase'
        }
    ]
});

const Question = model('Question', questionSchema);

module.exports = Question;