const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');

const tourRoute = require('./routes/tours.js');
const userRoute = require('./routes/users.js');
const authRoute = require('./routes/auth.js');
const reviewRoute = require('./routes/reviews.js');
const bookingRoute = require('./routes/bookings.js');

const app = express();

// Correct CORS config
const corsOptions = {
    origin: "http://localhost:3000", // frontend origin
    credentials: true                // MUST be lowercase
};

// Connect to MongoDB
connectToDb();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

//  Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/booking', bookingRoute);

// Simple test route
app.get('/', (req, res) => {
    res.send('API is working ✅');
});

module.exports = app;
