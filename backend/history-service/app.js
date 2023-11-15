const { testHistoryDbConnection } = require('./db/database')
const cors = require('cors');
const express = require('express');
const historyRoute = require('./routes/historyRoute')

testHistoryDbConnection();

const app = express();
app.use(express.json());

const corsOption = {
    origin: ['http://localhost:3000', 'https://peer-prep-ywhzo.ondigitalocean.app'],
    methods: 'GET, POST',
    credentials: true
};
app.use(cors(corsOption));

app.use('/history-service', historyRoute);

app.listen(3008, () => {
    console.log(`Service running on port 3008.`);
});