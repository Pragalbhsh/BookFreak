import { useState, useEffect } from 'react';
import api from '../utils/api';
import BookCard from '../components/book/BookCard';
import toast from 'react-hot-toast';

export default function Wishlist() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await api.get('/wishlist');
            setBooks(res.data);
        } catch (err) {
            toast.error('Could not load wishlist');
        } finally {
            setLoading(false);
        }
    };

    if(loading) return (
        <div className="min-h-screen flex items-center justify-center text-gray-400">
            Loading...
        </div>
    );

    return (
        <div className="bg-background min-h-screen py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="font-heading text-3xl text-primary font-bold mb-2">
                    My Wishlist ❤️
                </h1>
                <p className="text-gray-500 text-sm mb-8">
                    {books.length} book{books.length !== 1 ? 's' : ''} saved
                </p>

                {books.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">📚</p>
                        <p className="text-gray-400 text-lg">No books wishlisted yet!</p>
                        <a href="/" className="text-accent hover:underline text-sm mt-2 block">
                            Browse books →
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map(book => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}