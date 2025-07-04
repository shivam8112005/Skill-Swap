import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
    barterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BarterRequest',
        required: true,
        unique: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    roomId: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);
