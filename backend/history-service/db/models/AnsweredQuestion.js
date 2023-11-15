const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db/database');

const AnsweredQuestion = sequelize.define('AnsweredQuestion', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    questionId: {
        type: DataTypes.STRING
    },
    questionTitle: {
        type: DataTypes.STRING
    },
    complexity: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    username2: {
        type: DataTypes.STRING
    },
    answeredAt: {
        type: DataTypes.STRING
    },
    isSolved: {
        type: DataTypes.BOOLEAN
    },
    roomId: {
        type: DataTypes.UUID
    }
}, {
    tableName: 'AnsweredQuestion'
});

AnsweredQuestion.sync()
    .then(() => console.log('Database table for history service (re)created.'));

module.exports = AnsweredQuestion;