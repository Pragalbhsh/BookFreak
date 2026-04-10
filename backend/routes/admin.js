const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { getAllUsers, getAllBooks, 
        deleteUser, deleteBook } = require('../controllers/adminController');

// all admin routes need BOTH middlewares
// first check logged in → then check if admin
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/books', authMiddleware, adminMiddleware, getAllBooks);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);
router.delete('/books/:id', authMiddleware, adminMiddleware, deleteBook);

module.exports = router;