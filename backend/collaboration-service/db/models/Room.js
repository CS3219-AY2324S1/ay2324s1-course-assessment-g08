const { sq } = require("../db.js");
const { DataTypes } = require("sequelize");

const Room = sq.define("Room", {
    roomId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    questionId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Room.sync().then(() => console.log("Room model synced"));

module.exports = Room;
