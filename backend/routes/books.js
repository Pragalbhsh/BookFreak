const authMiddleware = require('../middleware/authMiddleware');
const {upload} = require('../config/cloudinary');
const { createBook, findbook, findbookById, updatebook, deletebook } = require('../controllers/bookController');
const express = require('express');
const router = express.Router();

router.post('/', authMiddleware , upload.array('images',5), createBook);
router.get('/', findbook);
router.get('/:id',findbookById);
router.put('/:id', authMiddleware, updatebook);
router.delete('/:id', authMiddleware, deletebook);

module.exports = router;