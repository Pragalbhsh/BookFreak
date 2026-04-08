const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// load env first!
dotenv.config();
connectDB();

const app = express();

// middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// routes
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const wishlistRoutes = require('./routes/wishlist');
const reviewRoutes = require('./routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// global error handler
app.use((err, req, res, next) => {
    console.log('GLOBAL ERROR:', err);
    res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});