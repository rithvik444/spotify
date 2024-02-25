const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    likedSongs: {
        type: String,
        default: ""
    },
    likedPlaylist: {
        type: String,
        default: ""
    },
    subscribedArtist: { // Corrected field name
        type: String,
        default: ""
    }
});

const user = mongoose.model("User", UserSchema);


module.exports = user;
