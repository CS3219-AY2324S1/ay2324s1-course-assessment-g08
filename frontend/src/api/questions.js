import axios from 'axios';

const baseUrl = process.env.REACT_APP_QUESTION_SERVICE_URL + "/question-service";

const setAuthenticationHeader = () => {
    return {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('credentials')).sessionToken}`}
    };
};

const fetchAllQuestions = async () => {
    try {
        const questions = await axios.get(baseUrl, setAuthenticationHeader())
        
        return questions.data;

    } catch (error) {
        console.error("Error when trying to fetch all questions: ", error);
    }
};

const fetchAllQuestionsComplexities = async () => {
    try {
        const questions = await axios.get(baseUrl + "/get-complexities", setAuthenticationHeader())

        return questions.data;
    } catch (error) {
        console.error("Error when trying to fetch question complexities: ", error);
    }
}

const fetchQuestionById = async (id) => {
    try {
        const question = await axios.get(baseUrl + `/questions/${id}`, setAuthenticationHeader());

        return question.data;
    } catch (error) {
        console.error("Error when trying to fetch question by id: ", error);
    }
};

const addQuestion = async (title, categories, complexity, description, testCases, expectedOutputs, codeTemplates) => {
    const questionToAdd = {
        title: title,
        categories: categories,
        complexity: complexity,
        description: description,
        inputs: testCases,
        outputs: expectedOutputs,
        codeTemplates: codeTemplates.reduce((result, item) => {
            result[item.language] = item.template;
            return result;
        }, {})
    };

    try {
        const response = await axios.post(baseUrl, questionToAdd, setAuthenticationHeader());

        return {
            message: response.data,
            status: response.status
        };
    } catch (error) {
        return {
            message: error.response.data.msg,
            status: error.response.status
        };
    }
};

const deleteQuestionsByIds = async (ids) => {
    try {
        const response = await axios.delete(baseUrl, { 
            data: { ids },
            ...setAuthenticationHeader()
        });

        return response.data;
    } catch (error) {
        console.error("Error when trying to delete questions by ids: ", error);
    }
}

const updateQuestion = async (question, title, categories, complexity, description, testCases, expectedOutputs, codeTemplates) => {
    const data = {
        questionId: question._id,
        title: title,
        categories: categories,
        complexity: complexity,
        description: description,
        inputs: testCases,
        outputs: expectedOutputs,
        codeTemplates: codeTemplates.reduce((result, item) => {
            result[item.language] = item.template;
            return result;
        }, {})
    };

    try {
        const response = await axios.put(baseUrl, data, setAuthenticationHeader());

        return {
            message: response.data,
            status: response.status
        };
    } catch (error) {
        return {
            message: error.response.data.msg,
            status: error.response.status
        };
    }
};

const getRandomQuestion = async complexity => {
    try {
        const randomQuestion = await axios.get(baseUrl + `/random/${complexity}`, setAuthenticationHeader())
        return randomQuestion.data;

    } catch (error) {
        console.error("Error when trying to fetch question: ", error);
    }
};

export {
    fetchAllQuestions,
    fetchAllQuestionsComplexities,
    fetchQuestionById,
    addQuestion,
    deleteQuestionsByIds,
    setAuthenticationHeader,
    getRandomQuestion,
    updateQuestion
};