const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const { createBook, getAllBooks, getBookById, 
        updateBook, deleteBook } = require('../controllers/bookController');

// book routes only!
router.post('/', authMiddleware, upload.array('images', 5), createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', authMiddleware, updateBook);
router.delete('/:id', authMiddleware, deleteBook);

module.exports = router;