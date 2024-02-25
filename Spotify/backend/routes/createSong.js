const express = require('express');
const passport = require('passport');
const router = express.Router();

router.post('/createsong', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { name, thumbanil, track } = req.body;
    // const artist = req.query.artist;
    const artist = req.user._id;
    const 
})








module.exports = router;
