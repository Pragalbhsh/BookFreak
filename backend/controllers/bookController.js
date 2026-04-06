const Book = require('../models/Book');
// @POST /api/books - Create book
const createBook = async (req, res) => {
    console.log('FILES:', req.files);  // add this
    console.log('BODY:', req.body);    // add this
    try {
        const { title, description, price, category, condition, language, city , type} = req.body;
        const images = req.files.map(file => file.path)
        const book = await Book.create({ title, description, price, category, condition, language, city, images ,type, seller: req.user._id});
        res.status(201).json(book);
    } catch (error) {
        console.log('FULL ERROR:', error); // add this
        res.status(500).json({ message: error.message });
    }
}
// @GET /api/books - Get all books
const findbook = async(req,res) => {
    try {
        const books = await Book.find().populate('seller','name avatar city');
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// @GET /api/books/:id - Get single book
const findbookById = async(req,res) => {
    try {
        const bookid = await Book.findById(req.params.id).populate('seller','name avatar city');
        if(!bookid) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(bookid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// @PUT /api/books/:id - Update book
const updatebook = async(req,res) => {
    try {
        const bookid = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(bookid);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// @DELETE /api/books/:id - Delete book
const deletebook = async(req,res) => {
    try {
        const book = await Book.findById(req.params.id)
        if(book.seller.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
       }
        await book.deleteOne();
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { createBook, findbook, findbookById, updatebook, deletebook };