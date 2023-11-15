const express = require('express');
const cors = require('cors');
const questionRoute = require('./routes/questionRoute');
const mongoose = require('mongoose');
require('dotenv').config();

// db connection
mongoose.connect(
    process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on('error', console.error.bind("connection error: "));
db.once('open', function() {
    console.log("Connected successfully");
});

// server
const app = express();

app.use(express.json());

const corsOption = {
    origin: ['http://localhost:3000', 'https://peer-prep-ywhzo.ondigitalocean.app'],
    methods: 'GET, POST, DELETE, PUT'
};
app.use(cors(corsOption));
app.options('*', cors(corsOption));

// routes
app.use("/question-service", questionRoute);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ msg: err.message || "Internal Server Error" });
});

app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001')
});