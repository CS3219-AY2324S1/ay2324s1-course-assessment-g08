const Question = require('../models/Question');
const TestCase = require('../models/TestCase');
const CodeTemplate = require('../models/CodeTemplate');

const getQuestionById = (req, res, next) => {
    const id = req.params.id;

    Question.findById(id)
        .populate('testCases')
        .populate('codeTemplate')
        .exec()
        .then(question => {
            if (!question) {
                return res.status(404).json({ error: 'Cannot find question' });
            }
            
            res.status(200).json(question);
        }).catch(err => next(err));
};

const getAllQuestions = (req, res, next) => {
    Question.find()
        .then(questions => res.status(200).json(questions))
        .catch(err => next(err));
};

const getAllQuestionsComplexity = (req, res, next) => {
    Question.find({}, 'complexity')
        .then(questions => res.status(200).json(questions))
        .catch(err => next(err));
}

const addQuestion = async (req, res, next) => {
    const savedTestCases = [];

    const newCodeTemplate = new CodeTemplate({
        templates: req.body.codeTemplates
    });

    const codeTemplateDocument = await newCodeTemplate.save();

    const testCasesPromises = req.body.inputs.map(async (input, index) => {
        const newTestCase = new TestCase({
            input: input,
            output: req.body.outputs[index]
        });

        const savedTestCase = await newTestCase.save();
        savedTestCases.push(savedTestCase._id);
    });

    Promise.all(testCasesPromises)
        .then(() => {
            const newQuestion = new Question({
                title: req.body.title,
                categories: req.body.categories,
                complexity: req.body.complexity,
                description: req.body.description,
                codeTemplate: codeTemplateDocument._id,
                testCases: savedTestCases
            });

            return newQuestion.save();
        })
        .then(question => {
            console.log('Question saved successfully: ' + question);
            res.status(201).send("Question saved successfully");
        })
        .catch(err => next(err));
};

const updateQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.body.questionId);

        if (question === null) {
            return res.status(400).json({
                msg: "Unable to find question with the id specified"
            })
        }

        await CodeTemplate.updateOne(
            { _id: question.codeTemplate },
            {
                $set: {
                    templates: req.body.codeTemplates
                },
            }
        );

        const updatedTestCases = [];
        const oldTestCasesUpdated = [];
        for (let i = 0; i < req.body.inputs.length; i++) {
            const res = await TestCase.updateOne(
                { _id: question.testCases[i] },
                {
                    $set: {
                        input: req.body.inputs[i],
                        output: req.body.outputs[i]
                    }
                }
            );
            
            if (res.matchedCount === 0) {
                const newTestCase = new TestCase({
                    input: req.body.inputs[i],
                    output: req.body.outputs[i]
                });

                newTestCase.save();

                updatedTestCases.push(newTestCase._id);
            } else {
                updatedTestCases.push(question.testCases[i]);
                oldTestCasesUpdated.push(question.testCases[i]);
            }
        }

        for (const id of question.testCases) {
            if (!oldTestCasesUpdated.includes(id)) {
                await TestCase.findByIdAndRemove(id);
            }
        }

        await Question.updateOne(
            { _id: req.body.questionId },
            {
                $set: {
                    title: req.body.title,
                    categories: req.body.categories,
                    complexity: req.body.complexity,
                    description: req.body.description,
                    testCases: updatedTestCases
                },
            }
        );

        return res.status(201).send("Question updated successfully");
    } catch (err) {
        console.error(err);
        return next(err);
    }
};


const deleteQuestion = async (req, res, next) => {
    const deleteIds = req.body.ids;

    try {
        for (const questionId of deleteIds) {
            Question.findByIdAndRemove(questionId)
                .then(async removedQuestion => {
                    if (removedQuestion) {
                        await TestCase.deleteMany({ _id: { $in: removedQuestion.testCases } });
                        await CodeTemplate.deleteOne({ _id: removedQuestion.codeTemplate });
                    }
                });
        }

        res.status(204).send('Questions were deleted successfully');
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const getRandomQuestion = (req, res, next) => {
    const complexity = req.params.complexity;

    Question.aggregate([
        { $match: { complexity: complexity } },
        { $sample: { size: 1 } }
    ])
    .then(questions => {
        if (questions.length === 0) {
            return res.status(404).json({ msg: "No questions found" });
        }

        return res.status(200).json(questions[0]);
    })
    .catch(err => next(err));
};

module.exports = {
    getQuestionById,
    getAllQuestions,
    getAllQuestionsComplexity,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    getRandomQuestion
};
