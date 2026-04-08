const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { toggleWishlist, getWishlist } = require('../controllers/wishlistController');

router.post('/:bookId', authMiddleware, toggleWishlist);
router.get('/', authMiddleware, getWishlist);

module.exports = router;