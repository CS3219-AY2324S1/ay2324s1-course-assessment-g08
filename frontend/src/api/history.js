import axios from "axios";

const baseUrl = process.env.REACT_APP_HISTORY_SERVICE_URL + "/history-service";

const setAuthenticationHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("credentials")).sessionToken
        }`,
      },
    };
};

const addAnsweredQuestion = (questionId, questionTitle, complexity, username, username2, answeredAt, isSolved, roomId) => {
    
    const details = {
        questionId,
        questionTitle,
        complexity,
        username,
        username2,
        answeredAt,
        isSolved,
        roomId
    }
    return axios
        .post(baseUrl + '/add-answered-question', details, setAuthenticationHeader())
        .then(response => ({
            message: response.data.msg,
            status: response.status,
        }))
        .catch((error) => ({
            message: error.response,
            status: error.response.status,
        }));
};

const fetchAllAnsweredQuestionsByUsername = async (username) => {
    try {
        const finalUrl = baseUrl + `/history/${username}`
        const answeredQuestions = await axios.get(finalUrl, setAuthenticationHeader());

        return answeredQuestions;
    } catch (error) {
        console.error("Error fetching user history!");
    }
}

export { addAnsweredQuestion, fetchAllAnsweredQuestionsByUsername };