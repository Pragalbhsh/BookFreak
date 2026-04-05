const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

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