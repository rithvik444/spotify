const express = require('express');
const router = express.Router();
const passport = require('passport');
const Song = require('../models/Song');
const user = require('../models/user');

router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        //req.user gets the user because of passport.authenticate

        console.log("you are in /create router");

        const { name, thumbnail, track } = req.body;

        if (!name || !thumbnail || !track) {
            return res.status(400).json({ error: "Insufficient details to create song." });
        }

        const artist = req.user._id;


        console.log("artist: " + artist);

        const songDetails = { name, thumbnail, track, artist };
        const createdSong = await Song.create(songDetails);

        console.log("song data  " + json(createdSong));

        return res.status(200).json(createdSong);

    } catch (error) {
        console.error("Error creating song:", error);
        return res.status(500).json({ error: "UnExpected Error occured while creation song" });
    }
});

router.get("/get/mysongs", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const currentUser = req.user;
    //we need to get all the songs where artist id==currentuser
    const songs = await Song.find({ artist: req.user._id });
    return res.status(200).json({ data: songs });
});




module.exports = router;
