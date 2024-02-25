const mongoose = require('mongoose');



const Playlist = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },

    Owner: {
        type: mongoose.Types
            .ObjectId,
        ref: "User",
    },
    songs: [
        {
            type: mongoose.Types.ObjectId,
            ref:"song",

        },
    ],
    collaborators: [
        {
            type: mongoose.Types.ObjectId,
            ref:"user"
        }
    ]

});




const PlaylistModel = mongoose.model("Playlist", Playlist);

module.exports = PlaylistModel;