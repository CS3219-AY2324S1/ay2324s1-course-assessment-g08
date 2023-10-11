const roomRepo = require('../db/repositories/RoomRepo');

const addRoom = async (req, res, next) => {
    const { roomId, questionId } = req.body;

    try {
        await roomRepo.addEntry(roomId, questionId);

        res.status(201).json({
            msg: "Successfully created"
        });
    } catch (e) {
        next(e);
    }
};

const getRoomById = async (req, res, next) => {
    const id = req.params.roomId;

    const room = await roomRepo.getByRoomId(id)
    
    if (room == null) {
        return res.status(404).json({ error: 'Cannot find room' });
    }

    res.status(200).json(room);
};

module.exports = {
    addRoom,
    getRoomById
}