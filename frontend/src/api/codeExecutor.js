import axios from 'axios';

const baseUrl = process.env.REACT_APP_CODE_EXEC_SERVICE_URL + "/code-exec-service";

const setAuthenticationHeader = () => {
    return {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('credentials')).sessionToken}`}
    };
};

const runAllTestCases = async (code, language, allInputs, allExpectedOutputs) => {
    const body = {
      code,
      language,
      allInputs,
      allExpectedOutputs
    };

    try {
        const res = await axios.post(baseUrl + '/execute-all', body, setAuthenticationHeader());
        
        return res.data.results;
    } catch (err) {
        console.error(err);
        return {
            message: err.response.data.message,
            status: err.response.data.status
        }
    }
};

export {
    runAllTestCases
};