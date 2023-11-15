const axios = require('axios');

const submitBatch = async (submissions) => {
    const options = {
        method: 'POST',
        url: process.env.CODE_EXECUTION_URL + '/submissions/batch',
        params: {
          base64_encoded: 'true'
        },
        headers: {
          'content-type': 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.X_RAPIDAPI_HOST
        },
        data: {
          submissions: submissions
        }
      };
      
      const tokens = [];
      try {
          const response = await axios.request(options);
          
          response.data.forEach(data => tokens.push(data.token));
      } catch (error) {
          console.error(error);
          throw new Error(error);
      }

      return tokens;
}

module.exports = {
    submitBatch
};