const ClientMap = require("../models/ClientMap");

const addEntry = async (socketId, username) => {
    await ClientMap.create({
        socketId,
        username,
    });
};

const getBySocketId = async (socketId) => {
    const clientMapping = await ClientMap.findByPk(socketId);
    if (clientMapping === null) {
        return null;
    }
    
    return clientMapping;
};

const deleteBySocketId = async (socketId) => {
    try {
        const clientMapping = await getBySocketId(socketId);

        if (clientMapping == null) {
            return false;
        }

        await clientMapping.destroy();

        return true;
    } catch (e) {
        throw new Error(e);
    }
};

module.exports = {
    addEntry,
    getBySocketId,
    deleteBySocketId,
};
