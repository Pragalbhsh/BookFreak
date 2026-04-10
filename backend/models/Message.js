const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // which room this message belongs to
    roomId: {
        type: String,
        required: true
    },
    // who sent it
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // the message text
    message: {
        type: String,
        required: true
    }
}, { timestamps: true }); // createdAt = when message was sent

module.exports = mongoose.model('Message', messageSchema);