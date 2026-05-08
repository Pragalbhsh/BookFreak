import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Chats() {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const res = await api.get('/chats');
            setChats(res.data);
        } catch (err) {
            toast.error('Could not load chats');
        } finally {
            setLoading(false);
        }
    };

    if(loading) return (
        <div className="min-h-screen flex items-center justify-center text-gray-400">
            Loading...
        </div>
    );

    return (
        <div className="bg-background min-h-screen py-10 px-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="font-heading text-3xl text-primary font-bold mb-6">
                    My Chats 💬
                </h1>

                {chats.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">💬</p>
                        <p className="text-gray-400 text-lg">No chats yet!</p>
                        <a href="/" className="text-accent hover:underline text-sm mt-2 block">
                            Browse books to start chatting →
                        </a>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {chats.map((chat, i) => (
                            <div
                                key={chat.roomId}
                                onClick={() => navigate(`/chat/${chat.sellerId}`)}
                                className={`flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition
                                    ${i !== chats.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {chat.otherUser?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-primary">
                                        {chat.otherUser?.name || 'Unknown User'}
                                    </p>
                                    <p className="text-sm text-gray-400 truncate">
                                        {chat.lastMessage}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400 shrink-0">
                                    {new Date(chat.lastMessageTime).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}