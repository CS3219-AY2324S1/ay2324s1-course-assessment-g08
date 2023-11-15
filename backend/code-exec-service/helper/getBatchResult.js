const axios = require('axios');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const getBatchResult = async (tokens) => {
    const getOptions = {
        method: 'GET',
        url: process.env.CODE_EXECUTION_URL + '/submissions/batch',
        params: {
            tokens: tokens.join(','),
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST
        }
    };

    try {
        let response = await axios.request(getOptions);
        let retryCount = 0;
        while (response.data.submissions[0].status.description === 'In Queue' || response.data.submissions[0].status.description === 'Processing') {
            await sleep(2000);

            response = await axios.request(getOptions);

            retryCount += 1;

            if (retryCount >= 10) {
                throw new Error("Server load too high, try again later");
            }
        }
        return response.data.submissions;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getBatchResult
};