import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookDetail from './pages/BookDetail';
import CreateListing from './pages/CreateListing';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Navbar from './components/common/Navbar';
import Chat from './pages/Chat';
import Admin from './pages/Admin';

export default function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/create" element={<CreateListing />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat/:sellerId" element={<Chat />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    );
}