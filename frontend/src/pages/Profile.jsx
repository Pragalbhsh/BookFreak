import { useState, useEffect } from 'react';
import api from '../utils/api';
import BookCard from '../components/book/BookCard';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user, logout } = useAuthStore();
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyBooks();
    }, []);

    // fetch only books listed by logged in user
    const fetchMyBooks = async () => {
        try {
            const res = await api.get('/books');
            // filter books where seller id matches logged in user
            const mine = res.data.filter(book => 
                book.seller?._id === user?.id || 
                book.seller?._id === user?._id
            );
            setMyBooks(mine);
        } catch (err) {
            toast.error('Could not load your listings');
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

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex items-center gap-6">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="font-heading text-2xl text-primary font-bold">
                            {user?.name}
                        </h1>
                        <p className="text-gray-500 text-sm">{user?.email}</p>
                        <p className="text-gray-400 text-sm mt-1">
                            {myBooks.length} listing{myBooks.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {/* Logout button */}
                    <button
                        onClick={logout}
                        className="text-red-400 hover:text-red-600 text-sm font-medium transition">
                        Logout
                    </button>
                </div>

                {/* My Listings */}
                <h2 className="font-heading text-2xl text-primary font-bold mb-6">
                    My Listings 📚
                </h2>

                {myBooks.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">📭</p>
                        <p className="text-gray-400 text-lg">No listings yet!</p>
                        <a href="/create" className="text-accent hover:underline text-sm mt-2 block">
                            Create your first listing →
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myBooks.map(book => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
