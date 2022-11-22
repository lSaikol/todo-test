const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    isFinished: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: { type: mongoose.Types.ObjectId, ref: "User" }
}, { collection: "Post" });

module.exports = mongoose.model("Post", postSchema);