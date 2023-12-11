const mongoose = require('mongoose');

const privateMessageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    messages: [
        {
            content: String,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

module.exports = PrivateMessage;