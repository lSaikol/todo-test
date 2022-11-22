const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, { collection: "Token" });

module.exports = mongoose.model("Token", tokenSchema);