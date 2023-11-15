const express = require('express');
const historyRouter = express.Router();
const historyController = require('../controllers/historyController');
const authenticateJwt = require('../middleware/authenticateJwt')

// Fetch all questions answered by username
historyRouter.get('/history/:username', authenticateJwt, historyController.getAllAnsweredQuestionsByUsername)

// Add question to answered list
historyRouter.post('/add-answered-question', authenticateJwt, historyController.createAnsweredQuestion)

module.exports =  historyRouter;