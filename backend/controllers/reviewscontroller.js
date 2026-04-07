const Review = require('../models/Review');

// @POST /api/reviews - Create review
const createReview = async (req, res) => {
    try {
        const userId = req.user._id;

        const existingReview = await Review.findOne({ bookId, userId });
        if(existingReview) {
            return res.status(400).json({ message: 'Review already exists' });
        }
        if(!bookId) {
            return res.status(400).json({ message: 'Book ID is required' });
        }
        if(!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        if(!comment) {
            return res.status(400).json({ message: 'Comment is required' });
        }
        if(comment.length > 1000) {
            return res.status(400).json({ message: 'Comment must be less than 1000 characters' });
        }
        if(comment.length < 10) {
            return res.status(400).json({ message: 'Comment must be at least 10 characters' });
        }
        const review = await Review.create({ bookId, userId, rating, comment });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @GET /api/reviews - Get all reviews
const getReviews = async (req, res) => {
    try {
        const bookId = req.params.bookId; 
        const reviews = await Review.find({ bookId });
        if(!reviews) {
            return res.status(400).json({ message: 'No reviews found' });
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @PUT /api/reviews - Update review
const updateReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const reviewId = req.params.reviewId; // reviewId is the id of the review to update
        const { rating, comment } = req.body;
        const existingReview = await Review.findOne({ reviewId, userId });
        if(!existingReview) {
            return res.status(400).json({ message: 'Review not found' });
        }
        if(!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        if(!comment) {
            return res.status(400).json({ message: 'Comment is required' });
        }
        if(comment.length > 1000) {
            return res.status(400).json({ message: 'Comment must be less than 1000 characters' });
        }
        if(comment.length < 10) {
            return res.status(400).json({ message: 'Comment must be at least 10 characters' });
        }
        const review = await Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @DELETE /api/reviews - Delete review (only admin can delete)
const deleteReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const reviewId = req.params.reviewId;
        const existingReview = await Review.findOne({ reviewId, userId });
        if(!existingReview) {
            return res.status(400).json({ message: 'Review not found' });
        }
        if(existingReview.userId !== userId) {
            return res.status(400).json({ message: 'You are not authorized to delete this review' });
        }
        await Review.findByIdAndDelete(reviewId);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReview, getReviews, updateReview, deleteReview };