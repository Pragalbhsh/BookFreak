import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
    // get user and logout from our global store
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();                    // clear user from store + localStorage
        navigate('/login');          // redirect to login page
    };

    return (
        <nav className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow-lg">
            {/* Logo */}
            <Link to="/" className="font-heading text-2xl font-bold text-accent">
                📚 BookFreak
            </Link>

            {/* Middle - Search bar */}
            <input
                type="text"
                placeholder="Search books..."
                className="hidden md:block w-1/3 px-4 py-2 rounded-full text-gray-800 text-sm outline-none"
            />

            {/* Right side - Nav links */}
            <div className="flex items-center gap-4 text-sm font-body">
                <Link to="/" className="hover:text-accent transition">Home</Link>

                {user ? (
                    <>
                        {/* show these when logged in */}
                        <Link to="/wishlist" className="hover:text-accent transition">❤️ Wishlist</Link>
                        <Link to="/create" className="bg-accent text-white px-4 py-2 rounded-full hover:opacity-90 transition">
                            + Sell Book
                        </Link>
                        <Link to="/profile" className="hover:text-accent transition">
                            👤 {user.name}
                        </Link>
                        <button onClick={handleLogout} className="hover:text-red-400 transition">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        {/* show these when logged out */}
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