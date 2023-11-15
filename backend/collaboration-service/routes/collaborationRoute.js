const express = require('express');
const collaborationRouter = express.Router();
const collaborationController = require('../controllers/collaborationController')
const authenticateJwt = require('../middleware/authenticateJwt');

// Adds a new room
collaborationRouter.post('/', authenticateJwt, collaborationController.addRoom);

// Gets a room by id
collaborationRouter.get('/:roomId', authenticateJwt, collaborationController.getRoomById)

// Update room question
collaborationRouter.put('/room-question', authenticateJwt, collaborationController.updateRoomQuestion);

module.exports = collaborationRouter;