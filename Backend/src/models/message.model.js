const mongoose = require("mongoose")

const MessageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;