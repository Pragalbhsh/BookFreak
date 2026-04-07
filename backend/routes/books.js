const authMiddleware = require('../middleware/authMiddleware');
const {upload} = require('../config/cloudinary');
const { createBook, findbook, findbookById, updatebook, deletebook } = require('../controllers/bookController');
const express = require('express');
const router = express.Router();
const { toggleWishlist, getWishlist } = require('../controllers/wishlistController');

router.post('/', authMiddleware , upload.array('images',5), createBook);
router.get('/', findbook);
router.get('/:id',findbookById);
router.put('/:id', authMiddleware, updatebook);
router.delete('/:id', authMiddleware, deletebook);
// all wishlist routes are protected (must be logged in)
router.post('/:bookId', authMiddleware, toggleWishlist); // add/remove
router.get('/', authMiddleware, getWishlist); // get all

// all review routes are protected (must be logged in)

router.post('/:reviewId', authMiddleware, createReview);
router.get('/:reviewId', authMiddleware, getReview);
router.put('/:reviewId', authMiddleware, updateReview);
router.post('/:reviewId', authMiddleware, deleteReview);


module.exports = router;