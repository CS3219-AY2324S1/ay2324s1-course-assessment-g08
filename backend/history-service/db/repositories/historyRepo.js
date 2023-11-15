const AnsweredQuestion = require('../models/AnsweredQuestion');

const addAnsweredQuestionInDb = (questionId, questionTitle, complexity, username, username2, answeredAt, isSolved, roomId) => {
    AnsweredQuestion.create({
        questionId,
        questionTitle,
        complexity,
        username,
        username2,
        answeredAt,
        isSolved,
        roomId
    })
}

module.exports = addAnsweredQuestionInDb