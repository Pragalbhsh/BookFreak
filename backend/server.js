const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');

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
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// global error handler
app.use((err, req, res, next) => {
    console.log('GLOBAL ERROR:', err);
    res.status(500).json({ message: err.message });
});

const http = require('http');
const { Server } = require('socket.io');

// create http server from express app
const server = http.createServer(app);

// attach socket.io to http server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

const Message = require('./models/Message');

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // user joins their chat room
    socket.on('join_room', async (roomId) => {
        socket.join(roomId);
        
        // load old messages from DB when user opens chat
        const messages = await Message.find({ roomId })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 }); // oldest first
        
        // send old messages only to THIS user
        socket.emit('old_messages', messages);
    });

    // user sends a message
    socket.on('send_message', async (data) => {
        // save to MongoDB
        const message = await Message.create({
            roomId: data.roomId,
            sender: data.senderId,
            message: data.message
        });

        // populate sender details
        const populated = await message.populate('sender', 'name avatar');

        // send to everyone in room
        io.to(data.roomId).emit('receive_message', populated);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// use server.listen instead of app.listen
server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT} 🚀`);
});