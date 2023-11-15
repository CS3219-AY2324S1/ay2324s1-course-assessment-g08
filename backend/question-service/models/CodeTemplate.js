const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const codeTemplateSchema = new Schema({
    templates: {
        type: Object,
        required: true
    }
});

const CodeTemplate = model('CodeTemplate', codeTemplateSchema);

module.exports = CodeTemplate;