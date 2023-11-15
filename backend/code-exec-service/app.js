const express = require('express');
const cors = require('cors');
const codeExecRoute = require('./routes/codeExecRoute');
require('dotenv').config();

const app = express();

app.use(express.json());

const corsOption = {
    origin: ['http://localhost:3000', 'https://peer-prep-ywhzo.ondigitalocean.app'],
    methods: 'GET, POST'
};
app.use(cors(corsOption));
app.options('*', cors(corsOption));

// routes
app.use("/code-exec-service", codeExecRoute);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ msg: err.message || "Internal Server Error" });
});

app.listen(3007, () => {
    console.log('Server is running on http://localhost:3007')
});