import socketIOClient from 'socket.io-client';
import { createRoom } from '../api/collaboration';
import { getRandomQuestion } from '../api/questions';

const matchingServiceURL = process.env.REACT_APP_MATCHING_SERVICE_URL;
const path = "/matching-service/socket.io";

let socket;

const createSocketConnection = (token) => {
    socket = socketIOClient(matchingServiceURL, {
        path,
        query: { token }
    });
};

const handleSocketEvents = (queueComplexity, matchFoundHandler) => {
    socket.on('connect', () => {
        console.log('WebSocket connection established');

        // Join the queue with the specified complexity
        socket.emit('joinQueue', queueComplexity);
    });

    socket.on('createRoom', async (roomId, queueComplexity) => {
        const randomQuestion = await getRandomQuestion(queueComplexity);

        await createRoom(roomId, randomQuestion._id);
    });

    socket.on('matchfound', async roomId => {
        socket.disconnect();
        matchFoundHandler(roomId);
    });

    socket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
    });

    socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        socket.close();
    });
};

export const connectMatchingSocket = (queueComplexity, token, matchFoundHandler) => {
    createSocketConnection(token);
    handleSocketEvents(queueComplexity, matchFoundHandler);
};

export { socket };