const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const { toggleWishlist, getWishlist } = require('../controllers/wishlistController');

// read from env file (very important thats why we right at first)
dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));  // Allow other websites to talk to us
app.use(express.json());  // // Understand JSON data customers send us
app.use(morgan('dev'));  // Log requests to the console or Write down every order that comes in (logging)
// Routes
app.use('/api/auth', authRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

const booksRoutes = require('./routes/books');
app.use('/api/books', booksRoutes);

const wishlistRoutes = require('./routes/wishlist');
app.use('/api/wishlist', wishlistRoutes);

const reviewsRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewsRoutes);
// Global error handler - add at the very bottom of server.js
app.use((err, req, res, next) => {
    console.log('GLOBAL ERROR:', err);
    res.status(500).json({ message: err.message });
});