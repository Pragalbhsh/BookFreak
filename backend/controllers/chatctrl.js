const Message = require('../models/Message');
const User = require('../models/User');

const getMyChats = async (req, res) => {
    try {
        const userId = (req.user._id || req.user.id).toString();

        const messages = await Message.find({
            roomId: { $regex: userId }
        })
        .sort({ createdAt: -1 });

        const rooms = {};
        messages.forEach(msg => {
            if(!rooms[msg.roomId]) {
                rooms[msg.roomId] = msg;
            }
        });

        const chats = await Promise.all(
            Object.values(rooms).map(async (msg) => {
                const ids = msg.roomId.split('_');
                const otherId = ids.find(id => id !== userId);

                if(!otherId) return null;

                const otherUser = await User.findById(otherId)
                    .select('name avatar');

                return {
                    roomId: msg.roomId,
                    otherUser,
                    lastMessage: msg.message,
                    lastMessageTime: msg.createdAt,
                    sellerId: otherId
                };
            })
        );

        const validChats = chats.filter(c => c !== null);
        res.status(200).json(validChats);

    } catch (error) {
        console.log('Chat error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyChats };