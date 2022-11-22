const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }]
}, { collection: "User" });

module.exports = mongoose.model("User", userSchema);