const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createReview, getReviews, 
        updateReview, deleteReview } = require('../controllers/reviewController');

router.post('/', authMiddleware, createReview);
router.get('/:bookId', getReviews);
router.put('/:reviewId', authMiddleware, updateReview);
router.delete('/:reviewId', authMiddleware, deleteReview);

module.exports = router;