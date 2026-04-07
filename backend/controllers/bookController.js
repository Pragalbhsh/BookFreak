const Book = require('../models/Book');
// @POST /api/books - Create book
const createBook = async (req, res) => {
    try {
        const { title, description, price, category, 
                condition, language, city, type } = req.body;
        // get image URLs from cloudinary (auto uploaded by multer)
        const images = req.files.map(file => file.path);
        const book = await Book.create({ 
            title, description, price, category, 
            condition, language, city, type, 
            images, seller: req.user._id 
        });
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @GET /api/books - Get all books
const getAllBooks = async (req, res) => {
    try {
        const { search, category, type, condition, 
                language, city, minPrice, maxPrice } = req.query;
        let query = {};
        // build filter query dynamically
        if(search) query.title = { $regex: search, $options: 'i' }; // case insensitive search
        if(category) query.category = category;
        if(type) query.type = type;
        if(condition) query.condition = condition;
        if(language) query.language = language;
        if(city) query.city = { $regex: city, $options: 'i' };
        if(minPrice || maxPrice) {
            query.price = {};
            if(minPrice) query.price.$gte = Number(minPrice); // greater than
            if(maxPrice) query.price.$lte = Number(maxPrice); // less than
        }
        const books = await Book.find(query)
            .populate('seller', 'name avatar city') // fill seller details
            .sort({ createdAt: -1 }); // newest first
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @GET /api/books/:id - Get single book
// GET SINGLE BOOK by ID
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('seller', 'name avatar city phone');
        if(!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @PUT /api/books/:id - Update book
// UPDATE BOOK - only owner can update
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).json({ message: 'Book not found' });
        // check if logged in user is the owner
        if(book.seller.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Not authorized' });
        const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @DELETE /api/books/:id - Delete book
// DELETE BOOK - only owner can delete
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).json({ message: 'Book not found' });
        // check if logged in user is the owner
        if(book.seller.toString() !== req.user._id.toString())
            return res.status(403).json({ message: 'Not authorized' });
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createBook, getAllBooks, getBookById, updateBook, deleteBook };