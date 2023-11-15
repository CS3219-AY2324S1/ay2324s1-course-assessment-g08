const WaitingList = require('../models/WaitingList');

const addEntry = (username, complexity, roomId) => {
    WaitingList.create({
        username,
        complexity,
        roomId
    });
};

const getByComplexity = async complexity => {
    try {
        const res = await WaitingList.findOne({ where: { complexity }});
        
        if (res == null) {
            return null;
        }

        await res.destroy();
    
        return res;
    } catch (error) {
        console.error("Error:", error);
    }
};

const getByUsername = async username => {
    const user = await WaitingList.findByPk(username);

    if (user == null) {
        return null;
    }

    return user;
};

const deleteByUsername = async username => {
    try {
        const row = await getByUsername(username);

        if (row == null) {
            return false;
        }

        await row.destroy();
        
        return true;
    } catch (e) {
        throw new Error(e);
    }
};

module.exports = {
    addEntry,
    getByUsername,
    deleteByUsername,
    getByComplexity
};