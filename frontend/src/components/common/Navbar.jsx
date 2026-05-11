import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    // menuOpen = is hamburger menu open?

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMenuOpen(false);
    };

    return (
        <nav className="bg-primary text-white shadow-lg">
            <div className="px-6 py-4 flex justify-between items-center">
                
                {/* Logo */}
                <Link to="/" className="font-heading text-2xl font-bold text-accent">
                    📚 BookFreak
                </Link>

                {/* Desktop links - hidden on mobile */}
                <div className="hidden md:flex items-center gap-4 text-sm">
                    <Link to="/" className="hover:text-accent transition">Home</Link>
                    {user ? (
                        <>
                            <Link to="/wishlist" className="hover:text-accent transition">❤️ Wishlist</Link>
                            <Link to="/chats" className="hover:text-accent transition">💬 Chats</Link>
                            <Link to="/create" className="bg-accent text-white px-4 py-2 rounded-full hover:opacity-90 transition">
                                + Sell Book
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="hover:text-accent transition">🛡️ Admin</Link>
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

                {/* Hamburger button - only on mobile */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-2">
                    {/* 3 lines = hamburger icon */}
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 
                        ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 
                        ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 
                        ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile menu - shows when hamburger clicked */}
            {menuOpen && (
                <div className="md:hidden bg-primary border-t border-blue-900 px-6 py-4 flex flex-col gap-4 text-sm">
                    <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-accent transition">
                        🏠 Home
                    </Link>
                    {user ? (
                        <>
                            <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="hover:text-accent transition">
                                ❤️ Wishlist
                            </Link>
                            <Link to="/chats" onClick={() => setMenuOpen(false)} className="hover:text-accent transition">
                                💬 Chats
                            </Link>
                            <Link to="/create" onClick={() => setMenuOpen(false)} className="bg-accent text-white px-4 py-2 rounded-full text-center hover:opacity-90 transition">
                                + Sell Book
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" onClick={() => setMenuOpen(false)} className="hover:text-accent transition">
                                    🛡️ Admin
                                </Link>
                            )}
                            <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-accent transition">
                                👤 {user.name}
                            </Link>
                            <button onClick={handleLogout} className="text-left hover:text-red-400 transition">
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-accent transition">
                                Login
                            </Link>
                            <Link to="/signup" onClick={() => setMenuOpen(false)} className="bg-accent text-white px-4 py-2 rounded-full text-center hover:opacity-90 transition">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}