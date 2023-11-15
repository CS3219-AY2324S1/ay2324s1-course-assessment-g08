const { sq } = require('../db.js');
const { DataTypes } = require('sequelize');

const WaitingList = sq.define("WaitingList", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    complexity: {
        type: DataTypes.ENUM(['Easy', 'Medium', 'Hard']),
        allowNull: false
    },
    roomId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

WaitingList.sync()
    .then(() => console.log("Waiting List model synced"));

module.exports = WaitingList;