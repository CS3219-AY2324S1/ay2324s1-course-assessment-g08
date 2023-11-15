const AnsweredQuestion = require('../db/models/AnsweredQuestion');
const addAnsweredQuestionInDb = require('../db/repositories/historyRepo');
const { Op } = require("sequelize");

const createAnsweredQuestion = (req, res) => {
    const {questionId, questionTitle, complexity, username, username2, answeredAt, isSolved, roomId } = req.body;

    try {
        addAnsweredQuestionInDb(questionId, questionTitle, complexity, username, username2, answeredAt, isSolved, roomId);

        res.status(201).json({
            success: "Question added to " + username + "'s history",
        });
    } catch (error) {
        res.status(404).json({ error: error });
    }
}

const getAllAnsweredQuestionsByUsername = async (req, res) => {
    const username = req.params.username;
    
    const answeredQuestions = await AnsweredQuestion.findAll({
        where: {
            [Op.or]: [
                { username: username },
                { username2: username }
              ]
        },
        raw: true
    })
    
    res.status(200).json(answeredQuestions);
}

module.exports = { createAnsweredQuestion, getAllAnsweredQuestionsByUsername };