const { sq } = require("../db.js");
const { DataTypes } = require("sequelize");

const ClientMap = sq.define("ClientMap", {
    socketId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

ClientMap.sync().then(() =>
    console.log("ClientMap model synced")
);

module.exports = ClientMap;
