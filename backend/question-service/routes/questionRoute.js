const express = require('express');
const questionRouter = express.Router();
const questionController = require('../controllers/questionController');
const { authenticateJwt, authenticateManager} = require('../middleware/authenticateJwt');
const { validateQuestion, validateUpdateQuestion } = require('../middleware/QuestionValidator');

// Fetch a question by id
questionRouter.get('/questions/:id', authenticateJwt, questionController.getQuestionById);

// Fetch all questions
questionRouter.get('/', authenticateJwt, questionController.getAllQuestions);

// Fetch all question complexities
questionRouter.get('/get-complexities', authenticateJwt, questionController.getAllQuestionsComplexity);

// Add a question
questionRouter.post('/', authenticateJwt, authenticateManager, validateQuestion(), questionController.addQuestion);

// Update a question
questionRouter.put('/', authenticateJwt, authenticateManager, validateUpdateQuestion(), questionController.updateQuestion);

// delete questions
questionRouter.delete('/', authenticateJwt, authenticateManager, questionController.deleteQuestion);

// Get random question by complexity
questionRouter.get('/random/:complexity', authenticateJwt, questionController.getRandomQuestion);

module.exports = questionRouter;