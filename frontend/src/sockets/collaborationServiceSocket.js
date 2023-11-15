import socketIOClient from "socket.io-client";

const collaborationServiceURL = process.env.REACT_APP_COLLABORATION_SERVICE_URL;
const path = "/collaboration-service/socket.io"

export const createSocketConnection = (token, roomId) => {
    const socket = socketIOClient(collaborationServiceURL, {
        path,
        "force new connection": true,
        reconnectionAttempts: 5,
        timeout: 10000,
        transports: ["websocket"],
        query: { token, roomId }
    });

    return socket;
};