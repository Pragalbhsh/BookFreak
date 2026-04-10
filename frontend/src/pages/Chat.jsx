import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

// connect to our backend socket server
const socket = io('http://localhost:8080');

export default function Chat() {
    const { sellerId } = useParams(); // seller's ID from URL
    const { user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null); // for auto scroll

    // room ID = combination of both user IDs (sorted so it's always same)
    const roomId = [user?.id, sellerId].sort().join('_');

    useEffect(() => {
        // join the chat room
        socket.emit('join_room', roomId);

        // receive old messages when joining
        socket.on('old_messages', (oldMessages) => {
            setMessages(oldMessages);
        });

        // receive new messages in real time
        socket.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // cleanup when leaving page
        return () => {
            socket.off('old_messages');
            socket.off('receive_message');
        };
    }, [roomId]);

    // auto scroll to bottom when new message arrives
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if(!newMessage.trim()) return; // don't send empty messages

        // emit message to server
        socket.emit('send_message', {
            roomId,
            senderId: user?.id || user?._id,
            message: newMessage
        });

        setNewMessage(''); // clear input
    };

    // send on Enter key
    const handleKeyPress = (e) => {
        if(e.key === 'Enter') sendMessage();
    };

    return (
        <div className="bg-background min-h-screen py-10 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                
                {/* Chat Header */}
                <div className="bg-primary text-white px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold">
                        S
                    </div>
                    <div>
                        <p className="font-medium">Seller</p>
                        <p className="text-xs text-gray-300">Online</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-6 flex flex-col gap-3">
                    {messages.length === 0 && (
                        <p className="text-center text-gray-400 text-sm mt-10">
                            No messages yet. Say hi! 👋
                        </p>
                    )}
                    {messages.map((msg, i) => {
                        // check if this message is from logged in user
                        const isMe = msg.sender?._id === user?.id || 
                                     msg.sender?._id === user?._id;
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