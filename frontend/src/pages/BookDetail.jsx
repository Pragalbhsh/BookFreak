import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function BookDetail() {
    const { id } = useParams(); // get book id from URL
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wishlisted, setWishlisted] = useState(false);
    const [activeImage, setActiveImage] = useState(0); // which image is showing

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            const res = await api.get(`/books/${id}`);
            setBook(res.data);
        } catch (err) {
            toast.error('Book not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleWishlist = async () => {
        if(!user) return toast.error('Please login first!');
        try {
            await api.post(`/wishlist/${id}`);
            setWishlisted(!wishlisted);
            toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
        } catch (err) {
            toast.error('Something went wrong');
        }
    };

    const handleDelete = async () => {
        if(!window.confirm('Delete this listing?')) return;
        try {
            await api.delete(`/books/${id}`);
            toast.success('Listing deleted');
            navigate('/');
        } catch (err) {
            toast.error('Could not delete');
        }
    };

    if(loading) return (
        <div className="min-h-screen flex items-center justify-center text-gray-400">
            Loading...
        </div>
    );

    if(!book) return null;

    // check if logged in user is the seller
    const isOwner = user?._id === book.seller?._id || 
                    user?.id === book.seller?._id;

    return (
        <div className="bg-background min-h-screen py-10 px-4">
            {/* Back button */}
        <div className="max-w-5xl mx-auto mb-4">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-primary hover:text-accent transition font-medium">
                ← Back
            </button>
        </div>
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">

                    {/* Left - Images */}
                    <div className="md:w-1/2 p-6">
                        {/* Main image */}
                        <img
                            src={book.images[activeImage] || 'https://via.placeholder.com/400'}
                            alt={book.title}
                            className="w-full h-80 object-cover rounded-xl"
                        />
                        {/* Thumbnail row */}
                        {book.images.length > 1 && (
                            <div className="flex gap-2 mt-3">
                                {book.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        onClick={() => setActiveImage(i)}
                                        className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2
                                            ${activeImage === i ? 'border-accent' : 'border-transparent'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right - Details */}
                    <div className="md:w-1/2 p-8">
                        {/* Type + Condition badges */}
                        <div className="flex gap-2 mb-3">
                            <span className={`text-xs px-3 py-1 rounded-full text-white font-medium
                                ${book.type === 'donate' ? 'bg-green-500' : 
                                  book.type === 'exchange' ? 'bg-blue-500' : 'bg-accent'}`}>
                                {book.type.toUpperCase()}
                            </span>
                            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                                {book.condition}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="font-heading text-3xl text-primary font-bold mb-2">
                            {book.title}
                        </h1>

                        {/* Price */}
                        <p className="text-accent text-3xl font-bold mb-4">
                            {book.type === 'donate' ? 'FREE' : `₹${book.price}`}
                        </p>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-6">{book.description}</p>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-gray-400">Category</span>
                                <p className="font-medium text-primary capitalize">{book.category}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-gray-400">Language</span>
                                <p className="font-medium text-primary capitalize">{book.language}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-gray-400">City</span>
                                <p className="font-medium text-primary">📍 {book.city}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <span className="text-gray-400">Seller</span>
                                <p className="font-medium text-primary">👤 {book.seller?.name}</p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            {isOwner ? (
                                <>
                                    {/* Owner sees edit + delete */}
                                    <button
                                        onClick={() => navigate(`/edit/${id}`)}
                                        className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
                                        Edit Listing
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    {/* contact seller button */}
                                    <button 
                                        onClick={() => navigate(`/chat/${book.seller?._id}`)}
                                        className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
                                        💬 Contact Seller
                                    </button>
                                    {/* wishlist button */}
                                    <button
                                        onClick={handleWishlist}
                                        className={`px-6 py-3 rounded-xl font-medium border-2 transition
                                            ${wishlisted ? 'bg-red-50 border-red-400 text-red-400' : 
                                              'border-gray-300 text-gray-500 hover:border-accent'}`}>
                                        {wishlisted ? '❤️' : '🤍'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}