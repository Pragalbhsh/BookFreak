import { useState, useEffect } from 'react';
import api from '../utils/api';
import BookCard from '../components/book/BookCard';

// categories list for filter row
const CATEGORIES = [
    { label: 'All', value: '' },
    { label: '📚 Fiction', value: 'fiction' },
    { label: '🎌 Manga', value: 'manga' },
    { label: '📝 Competitive', value: 'competitive exams' },
    { label: '🔧 Engineering', value: 'engineering' },
    { label: '🏥 Medical', value: 'medical' },
    { label: '🏫 School', value: 'school' },
    { label: '💼 Business', value: 'business' },
    { label: '🧘 Self Help', value: 'self help' },
    { label: '👶 Children', value: 'children' },
    { label: '🙏 Religion', value: 'religion' },
    { label: '🌍 Language', value: 'language learning' },
];

export default function Home() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        type: '', condition: '', minPrice: '', maxPrice: ''
    });

    // fetch books whenever filters change
    useEffect(() => {
        fetchBooks();
    }, [selectedCategory, search, filters]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            // build query string from filters
            const params = new URLSearchParams();
            if(search) params.append('search', search);
            if(selectedCategory) params.append('category', selectedCategory);
            if(filters.type) params.append('type', filters.type);
            if(filters.condition) params.append('condition', filters.condition);
            if(filters.minPrice) params.append('minPrice', filters.minPrice);
            if(filters.maxPrice) params.append('maxPrice', filters.maxPrice);

            const res = await api.get(`/books?${params.toString()}`);
            setBooks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen">

            {/* Hero Section */}
            <div className="bg-primary text-white py-16 px-6 text-center">
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                    Find Your Next <span className="text-accent">Book</span>
                </h1>
                <p className="text-gray-300 mb-8 text-lg">
                    Buy, sell or donate second-hand books in your city
                </p>
                {/* Search bar */}
                <div className="max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search by book title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-6 py-3 rounded-full text-gray-800 text-sm outline-none shadow-lg"
                    />
                </div>
            </div>

            {/* Categories Row */}
            <div className="flex gap-3 overflow-x-auto px-6 py-4 bg-white shadow-sm">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition
                            ${selectedCategory === cat.value 
                                ? 'bg-primary text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">

                {/* Filters Sidebar */}
                <div className="hidden md:block w-64 shrink-0">
                    <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
                        <h3 className="font-heading text-primary font-semibold text-lg mb-4">
                            Filters
                        </h3>

                        {/* Type filter */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700">Type</label>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
                            >
                                <option value="">All</option>
                                <option value="sell">Sell</option>
                                <option value="donate">Donate</option>
                                <option value="exchange">Exchange</option>
                            </select>
                        </div>

                        {/* Condition filter */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700">Condition</label>
                            <select
                                value={filters.condition}
                                onChange={(e) => setFilters({...filters, condition: e.target.value})}
                                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
                            >
                                <option value="">All</option>
                                <option value="new">New</option>
                                <option value="like new">Like New</option>
                                <option value="good">Good</option>
                                <option value="acceptable">Acceptable</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700">Price Range</label>
                            <div className="flex gap-2 mt-1">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none"
                                />
                            </div>
                        </div>

                        {/* Clear filters */}
                        <button
                            onClick={() => setFilters({ type: '', condition: '', minPrice: '', maxPrice: '' })}
                            className="w-full text-sm text-red-400 hover:text-red-600 transition mt-2"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Books Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading books...</div>
                    ) : books.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            No books found 😔
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {books.map(book => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
