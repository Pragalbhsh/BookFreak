import { Link } from 'react-router-dom';

// BookCard = one book listing card in the grid
export default function BookCard({ book }) {
    return (
        <Link to={`/books/${book._id}`} 
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group">
            
            {/* Book Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={book.images[0] || 'https://via.placeholder.com/300x200'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {/* Type badge - sell/donate/exchange */}
                <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-medium text-white
                    ${book.type === 'donate' ? 'bg-green-500' : 
                      book.type === 'exchange' ? 'bg-blue-500' : 'bg-accent'}`}>
                    {book.type.toUpperCase()}
                </span>
            </div>

            {/* Book Info */}
            <div className="p-4">
                <h3 className="font-heading text-primary font-semibold text-lg truncate">
                    {book.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 truncate">{book.description}</p>
                
                <div className="flex justify-between items-center mt-3">
                    {/* Price */}
                    <span className="text-accent font-bold text-lg">
                        {book.type === 'donate' ? 'FREE' : `₹${book.price}`}
                    </span>
                    {/* Condition badge */}
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {book.condition}
                    </span>
                </div>

                {/* Seller + City */}
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <span>📍 {book.city}</span>
                    <span>•</span>
                    <span>by {book.seller?.name}</span>
                </div>
            </div>
        </Link>
    );
}