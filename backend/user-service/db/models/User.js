const { sq } = require('../db.js');
const { DataTypes } = require('sequelize');

const User = sq.define("user", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isManager: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

User.sync()
    .then(() => console.log("User model synced"));

module.exports = User;