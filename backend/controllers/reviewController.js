const Review = require('../models/Review');

// @POST /api/reviews - Create review
const createReview = async (req, res) => {
    try {
        // destructure inside the function!
        const { bookId, rating, comment } = req.body;
        const userId = req.user._id;

        if(!bookId) return res.status(400).json({ message: 'Book ID is required' });
        if(!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        if(!comment) return res.status(400).json({ message: 'Comment is required' });

        const existingReview = await Review.findOne({ bookId, userId });
        if(existingReview) return res.status(400).json({ message: 'Review already exists' });

        const review = await Review.create({ bookId, userId, rating, comment });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @GET /api/reviews/:bookId - Get all reviews for a book
const getReviews = async (req, res) => {
    try {
        const { bookId } = req.params;
        const reviews = await Review.find({ bookId })
            .populate('userId', 'name avatar');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @PUT /api/reviews/:reviewId - Update review
const updateReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const existingReview = await Review.findById(reviewId);
        if(!existingReview) return res.status(404).json({ message: 'Review not found' });
        if(existingReview.userId.toString() !== userId.toString()) 
            return res.status(403).json({ message: 'Not authorized' });

        const review = await Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @DELETE /api/reviews/:reviewId - Delete review
const deleteReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { reviewId } = req.params;

        const existingReview = await Review.findById(reviewId);
        if(!existingReview) return res.status(404).json({ message: 'Review not found' });
        if(existingReview.userId.toString() !== userId.toString())
            return res.status(403).json({ message: 'Not authorized' });

        await Review.findByIdAndDelete(reviewId);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReview, getReviews, updateReview, deleteReview };