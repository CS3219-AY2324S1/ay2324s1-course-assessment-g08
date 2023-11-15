const express = require('express');
const codeExecRouter = express.Router();
const codeExecController = require('../controllers/codeExecController');
const { authenticateJwt } = require('../middleware/authenticateJwt');

// Fetch a question by id
codeExecRouter.post('/execute-all', authenticateJwt, codeExecController.runAllTestCases);

module.exports = codeExecRouter;