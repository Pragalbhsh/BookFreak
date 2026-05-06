import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

// socket created ONCE outside component
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const socketUrl = new URL(apiBase).origin;
const socket = io(socketUrl, {
    transports: ['websocket', 'polling']
});

export default function Chat() {
    const { sellerId } = useParams();
    // useParams gets the sellerId from URL
    // /chat/69d22... → sellerId = "69d22..."

    const { user } = useAuthStore();
    // get logged in user from zustand

    const navigate = useNavigate();
    // to go back

    const [messages, setMessages] = useState([]);
    // stores all messages in this chat

    const [newMessage, setNewMessage] = useState('');
    // stores what user is typing

    const messagesEndRef = useRef(null);
    // reference to bottom of chat for auto scroll

    const myId = user?._id || user?.id;
    // get my ID (handle both formats)

    const roomId = [myId, sellerId].sort().join('_');
    // create unique room ID
    // sort so it's always same regardless of who opens
    // "abc_def" is same room for both abc and def

    useEffect(() => {
        // join the chat room when page loads
        socket.emit('join_room', roomId);

        // receive old messages from DB
        socket.on('old_messages', (oldMessages) => {
            setMessages(oldMessages);
        });

        // receive new messages in real time
        socket.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
            // prev = current messages
            // add new message to end of array
        });

        // cleanup when leaving page
        return () => {
            socket.off('old_messages');
            socket.off('receive_message');
            // remove listeners so they don't stack up
        };
    }, [roomId]);

    // auto scroll to bottom when new message arrives
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if(!newMessage.trim()) return;
        // trim() removes spaces
        // don't send empty messages

        socket.emit('send_message', {
            roomId,
            senderId: myId,
            message: newMessage
        });
        // emit = send event to server
        // server saves to DB and sends to room

        setNewMessage('');
        // clear input after sending
    };

    const handleKeyPress = (e) => {
        if(e.key === 'Enter') sendMessage();
        // send on Enter key press
    };

    return (
        <div className="bg-background min-h-screen py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

                {/* Chat Header */}
                <div className="bg-primary text-white px-6 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-white hover:text-accent transition mr-2">
                        ← Back
                    </button>
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold">
                        S
                    </div>
                    <div>
                        <p className="font-medium">Seller</p>
                        <p className="text-xs text-gray-300">BookFreak Chat</p>
                    </div>
                </div>

                {/* Messages area */}
                <div className="h-96 overflow-y-auto p-6 flex flex-col gap-3">
                    {messages.length === 0 && (
                        <p className="text-center text-gray-400 text-sm mt-10">
                            No messages yet. Say hi! 👋
                        </p>
                    )}
                    {messages.map((msg, i) => {
                        const senderId = msg.sender?._id || msg.sender;
                        const isMe = senderId?.toString() === myId?.toString();
                        // isMe = did I send this message?
                        // true → show on right (blue)
                        // false → show on left (gray)

                        return (
                            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm
                                    ${isMe
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                    <p>{msg.message}</p>
                                    <p className={`text-xs mt-1 ${isMe ? 'text-gray-300' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([],
                                            { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {/* invisible div at bottom for auto scroll */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}