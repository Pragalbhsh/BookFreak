import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import useAuthStore from '../store/authStore';

export default function Login() {
    // form state - stores what user types
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();

    // updates form state when user types
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload
        setLoading(true);
        try {
            const res = await api.post('/auth/login', form);
            setAuth(res.data.user, res.data.token); // save to store + localStorage
            toast.success('Welcome back! 📚');
            navigate('/'); // go to home
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                {/* Header */}
                <h1 className="font-heading text-3xl text-primary font-bold text-center mb-2">
                    Welcome Back 👋
                </h1>
                <p className="text-center text-gray-500 text-sm mb-6">
                    Login to your BookFreak account
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="parth@gmail.com"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {/* Signup link */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-accent font-medium hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
