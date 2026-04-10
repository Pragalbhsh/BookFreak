import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow-lg">
            {/* Logo */}
            <Link to="/" className="font-heading text-2xl font-bold text-accent">
                📚 BookFreak
            </Link>

            {/* Right side - Nav links */}
            <div className="flex items-center gap-4 text-sm font-body">
                <Link to="/" className="hover:text-accent transition">Home</Link>

                {user ? (
                    <>
                        <Link to="/wishlist" className="hover:text-accent transition">❤️ Wishlist</Link>
                        <Link to="/create" className="bg-accent text-white px-4 py-2 rounded-full hover:opacity-90 transition">
                            + Sell Book
                        </Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="hover:text-accent transition">
                                🛡️ Admin
                            </Link>
                        )}
                        <Link to="/profile" className="hover:text-accent transition">
                            👤 {user.name}
                        </Link>
                        <button onClick={handleLogout} className="hover:text-red-400 transition">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-accent transition">Login</Link>
                        <Link to="/signup" className="bg-accent text-white px-4 py-2 rounded-full hover:opacity-90 transition">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}