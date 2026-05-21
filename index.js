require('dotenv').config();

const express = require('express');
const path = require('path');

const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Static Frontend
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/url'));

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);