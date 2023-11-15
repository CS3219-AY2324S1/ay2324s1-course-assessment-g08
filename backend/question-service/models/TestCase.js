const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const testCaseSchema = new Schema({
    input: {
        type: Object,
        required: true
    },
    output: {
        type: Schema.Types.Mixed,
        required: true
    }
});

const TestCase = model('TestCase', testCaseSchema);

module.exports = TestCase;