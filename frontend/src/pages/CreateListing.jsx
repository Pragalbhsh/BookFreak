import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = [
    'fiction', 'manga', 'competitive exams', 'engineering',
    'medical', 'school', 'business', 'self help',
    'children', 'biography', 'religion', 'language learning'
];

export default function CreateListing() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]); // actual file objects
    const [previews, setPreviews] = useState([]); // preview URLs
    const [form, setForm] = useState({
        title: '', description: '', price: '',
        category: '', condition: '', language: 'english',
        city: '', type: 'sell'
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // when user selects images
    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        // create preview URLs so user can see selected images
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviews(urls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(images.length === 0) return toast.error('Please add at least one image!');
        
        setLoading(true);
        try {
            // FormData because we're sending files + text together
            const formData = new FormData();
            Object.keys(form).forEach(key => formData.append(key, form[key]));
            images.forEach(img => formData.append('images', img));

            await api.post('/books', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Listing created! 🎉');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h1 className="font-heading text-3xl text-primary font-bold mb-2">
                    Create Listing 📚
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                    Fill in the details to list your book
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Book Title</label>
                        <input
                            name="title" value={form.title} onChange={handleChange}
                            placeholder="e.g. Harry Potter and the Sorcerer's Stone"
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

                    {/* Type + Condition row */}
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

                    {/* Price + City row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Price (₹) {form.type === 'donate' && '(set 0 for free)'}
                            </label>
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

                    {/* Category + Language row */}
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

                    {/* Image Upload */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Book Images (max 5)
                        </label>
                        <input
                            type="file" multiple accept="image/*"
                            onChange={handleImages}
                            className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white hover:file:opacity-90"
                        />
                        {/* Image previews */}
                        {previews.length > 0 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {previews.map((url, i) => (
                                    <img key={i} src={url} 
                                        className="w-20 h-20 object-cover rounded-lg border"/>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50">
                        {loading ? 'Creating listing...' : 'Create Listing 🚀'}
                    </button>
                </form>
            </div>
        </div>
    );
}