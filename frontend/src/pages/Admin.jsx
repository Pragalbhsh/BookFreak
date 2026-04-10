import { useState, useEffect } from 'react';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Admin() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [activeTab, setActiveTab] = useState('books'); // books or users

    useEffect(() => {
        // redirect if not admin
        if(user?.role !== 'admin') {
            toast.error('Admin access only!');
            navigate('/');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, booksRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/books')
            ]);
            setUsers(usersRes.data);
            setBooks(booksRes.data);
        } catch (err) {
            toast.error('Failed to load data');
        }
    };

    const deleteUser = async (id) => {
        if(!window.confirm('Delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            toast.success('User deleted');
        } catch (err) {
            toast.error('Could not delete user');
        }
    };

    const deleteBook = async (id) => {
        if(!window.confirm('Delete this listing?')) return;
        try {
            await api.delete(`/admin/books/${id}`);
            setBooks(books.filter(b => b._id !== id));
            toast.success('Listing deleted');
        } catch (err) {
            toast.error('Could not delete listing');
        }
    };

    return (
        <div className="bg-background min-h-screen py-10 px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-heading text-3xl text-primary font-bold">
                        Admin Panel 🛡️
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage all users and listings
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-gray-400 text-sm">Total Users</p>
                        <p className="font-heading text-4xl text-primary font-bold mt-1">
                            {users.length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-gray-400 text-sm">Total Listings</p>
                        <p className="font-heading text-4xl text-primary font-bold mt-1">
                            {books.length}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('books')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition
                            ${activeTab === 'books' 
                                ? 'bg-primary text-white' 
                                : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                        📚 Listings ({books.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition
                            ${activeTab === 'users' 
                                ? 'bg-primary text-white' 
                                : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                        👥 Users ({users.length})
                    </button>
                </div>

                {/* Books Tab */}
                {activeTab === 'books' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="text-left px-6 py-3">Book</th>
                                    <th className="text-left px-6 py-3">Seller</th>
                                    <th className="text-left px-6 py-3">Price</th>
                                    <th className="text-left px-6 py-3">Type</th>
                                    <th className="text-left px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map(book => (
                                    <tr key={book._id} className="border-t border-gray-50 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-primary">
                                            {book.title}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {book.seller?.name}
                                        </td>
                                        <td className="px-6 py-4 text-accent font-medium">
                                            {book.type === 'donate' ? 'FREE' : `₹${book.price}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs text-white
                                                ${book.type === 'donate' ? 'bg-green-500' : 
                                                  book.type === 'exchange' ? 'bg-blue-500' : 'bg-accent'}`}>
                                                {book.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => deleteBook(book._id)}
                                                className="text-red-400 hover:text-red-600 font-medium transition">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="text-left px-6 py-3">Name</th>
                                    <th className="text-left px-6 py-3">Email</th>
                                    <th className="text-left px-6 py-3">Role</th>
                                    <th className="text-left px-6 py-3">Joined</th>
                                    <th className="text-left px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-primary">
                                            {u.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {u.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                                                ${u.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-600' 
                                                    : 'bg-gray-100 text-gray-600'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.role !== 'admin' && (
                                                <button
                                                    onClick={() => deleteUser(u._id)}
                                                    className="text-red-400 hover:text-red-600 font-medium transition">
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}