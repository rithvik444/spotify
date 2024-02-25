
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/user'); // Corrected import
// const songRoutes = require('./routes/songRout');

const songRoutes = require('./routes/createSong');

const authRoutes = require('./routes/authNew');
require('dotenv').config(); // Load environment variables

// Port number
const port = process.env.PORT || 3000;

// MongoDB connection URL
const db = process.env.MONGODB_URL;
app.use(express.json());
// MongoDB connection
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error while connecting to MongoDB:", err);
});

// Setup passport-jwt
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET // Use environment variable for secret key
};

// passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
//     User.findOne({ _id: jwt_payload.sub }, function (err, user) { // Use _id instead of id
//         console.log(_id);
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//         }
//     });
// }));

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        const user = await User.findOne({ _id: jwt_payload.sub });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));





// Middleware


// Routes
app.get('/', (req, res) => {
    res.send("Server is running successfully");
});

app.use('/auth', authRoutes);
app.use('/song', songRoutes);


// Error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
