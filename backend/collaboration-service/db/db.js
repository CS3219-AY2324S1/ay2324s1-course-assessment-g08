const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Successfully connected to database");
    } catch (e) {
        console.error("Unable to connect to the database: ", e);
    }
};

module.exports = { sq: sequelize, testDbConnection };