


const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { getToken } = require('../utils/helpers');


router.post('/signup', async (req, res) => {
    const { email, password, name, username } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });
  
        if (existingUser) {
            return res.status(403).json({ error: "User already exists" });
   
        }
      
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUserData = {
            email,
            password: hashedPassword,
            name,
            username
        };
        const newUser = await User.create(newUserData);

        // Generate token
            getToken(email, newUser).then(token => {
            //console.log('token generated' + token);

            const userToReturn = { ...newUser.toJSON(), token };
            delete userToReturn.password;

            // Send response with token
            return res.status(200).json(userToReturn);

        }).catch(err => {
            console.log('error generating token');
            console.log(err)
        });




    } catch (error) {
        // Handle any errors
        console.error("Error occurred during signup:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

//------login router---------------------

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ error: "Password Does not match" });
        }

        // Generate token
        const token = await getToken(email, user);
        const userToReturn = { ...user.toJSON(), token };
        delete userToReturn.password;

        return res.status(200).json(userToReturn);


    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});





module.exports = router;
