const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/userRoute');
const { testDbConnection } = require('./db/db');

testDbConnection();

// server
const app = express();
app.use(express.json());

const corsOption = {
    origin: ['http://localhost:3000', 'https://peer-prep-ywhzo.ondigitalocean.app'],
    methods: 'GET, POST, DELETE, PUT',
    credentials: true
};
app.use(cors(corsOption));

// routes
app.use('/user-service', userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ msg: err.message || "Internal Server Error" });
});

app.listen(3002, () => {
    console.log('Server is running on http://localhost:3002')
});