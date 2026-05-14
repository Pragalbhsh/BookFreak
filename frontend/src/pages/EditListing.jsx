import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
    'fiction', 'manga', 'competitive exams', 'engineering',
    'medical', 'school', 'business', 'self help',
    'children', 'biography', 'religion', 'language learning'
];

export default function EditListing() {
    const { id } = useParams();
    // get book id from URL /edit/69d390...

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [form, setForm] = useState({
        title: '', description: '', price: '',
        category: '', condition: '', language: 'english',
        city: '', type: 'sell'
    });

    // fetch existing book data when page loads
    useEffect(() => {
        fetchBook();
    }, []);

    const fetchBook = async () => {
        try {
            const res = await api.get(`/books/${id}`);
            const book = res.data;
            // pre-fill form with existing data
            setForm({
                title: book.title,
                description: book.description,
                price: book.price,
                category: book.category,
                condition: book.condition,
                language: book.language,
                city: book.city,
                type: book.type
            });
        } catch (err) {
            toast.error('Could not load listing');
            navigate('/');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/books/${id}`, form);
            toast.success('Listing updated! 🎉');
            navigate(`/books/${id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if(fetching) return (
        <div className="min-h-screen flex items-center justify-center text-gray-400">
            Loading...
        </div>
    );

    return (
        <div className="bg-background min-h-screen py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="text-primary hover:text-accent transition font-medium mb-6 block">
                    ← Back
                </button>

                <h1 className="font-heading text-3xl text-primary font-bold mb-2">
                    Edit Listing 
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                    Update your book listing details
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Book Title</label>
                        <input
                            name="title" value={form.title} onChange={handleChange}
                            placeholder="e.g. Harry Potter"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description" value={form.description} onChange={handleChange}
                            placeholder="Describe the book condition, edition, etc."
                            rows={3}
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Type + Condition */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Type</label>
                            <select
                                name="type" value={form.type} onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none">
                                <option value="sell">Sell</option>
                                <option value="donate">Donate</option>
                                <option value="exchange">Exchange</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Condition</label>
                            <select
                                name="condition" value={form.condition} onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                                required>
                                <option value="">Select condition</option>
                                <option value="new">New</option>
                                <option value="like new">Like New</option>
                                <option value="good">Good</option>
                                <option value="acceptable">Acceptable</option>
                            </select>
                        </div>
                    </div>

                    {/* Price + City */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                            <input
                                name="price" value={form.price} onChange={handleChange}
                                type="number" placeholder="200"
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">City</label>
                            <input
                                name="city" value={form.city} onChange={handleChange}
                                placeholder="Jaipur"
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    {/* Category + Language */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category" value={form.category} onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                                required>
                                <option value="">Select category</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Language</label>
                            <select
                                name="language" value={form.language} onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none">
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50">
                        {loading ? 'Updating...' : 'Listing Updated'}
                    </button>
                </form>
            </div>
        </div>
    );
}