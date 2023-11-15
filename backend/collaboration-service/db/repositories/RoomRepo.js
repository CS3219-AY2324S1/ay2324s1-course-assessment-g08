const Room = require('../models/Room');

const addEntry = async (roomId, questionId) => {
    const room = await Room.findByPk(roomId);

    if (!room) {
        Room.create({
            roomId,
            questionId
        });
    }
};

const getByRoomId = async (roomId) => {
    const room = await Room.findByPk(roomId);

    if (room == null) {
        return null;
    }

    return room;
};

const deleteById = async (roomId) => {
    try {
        const room = await getByRoomId(roomId);

        if (room == null) {
            return false;
        }

        await room.destroy();
        
        return true;
    } catch (e) {
        throw new Error(e);
    }
};

const updateRoomQuestion = async (roomId, questionId) => {
    const room = await getByRoomId(roomId);

    if (room === null) {
        return false;
    }

    room.questionId = questionId;
    await room.save();

    return true;
};

module.exports = {
    addEntry,
    getByRoomId,
    deleteById,
    updateRoomQuestion
};