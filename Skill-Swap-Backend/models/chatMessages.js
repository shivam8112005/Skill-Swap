import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    barterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BarterRequest', // Assuming you have a BarterRequest model
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
