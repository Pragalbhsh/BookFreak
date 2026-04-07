const User = require('../models/User');

// ADD or REMOVE from wishlist (toggle)
const toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const bookId = req.params.bookId;

        // check if book already in wishlist
        const isWishlisted = user.wishlist.includes(bookId);

        if(isWishlisted) {
            // remove it
            user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
        } else {
            // add it
            user.wishlist.push(bookId);
        }

        await user.save();
        res.status(200).json({ 
            message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET all wishlisted books
const getWishlist = async (req, res) => {
    try {
        // populate fills in full book details instead of just IDs
        const user = await User.findById(req.user._id)
            .populate('wishlist');
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { toggleWishlist, getWishlist };