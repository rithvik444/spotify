
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { getToken } = require('../utils/helpers');

// POST routes
//----------------------------Signup router ----------------------------

//post routes
// router.post("/register", async (req, res) => {
//     const { name, email, password, username } = req.body;
//     const user = await User.findOne({ email: email });
//     if (user) {
//         return res
//             .status(403)
//             .json({ error: "A user with this email alredy exist" });
//     }
//     const hashedPassword = bcrypt.hash(password, 10);
//     const newUserData = { email, password: hashedPassword, username, name };
//     const newUser = await User.create(newUserData);

//     const token = getToken(email, newUser);
//     const userToReturn = { ...newUserData.toJSON(), token };
//     delete userToReturn.password;
//     return res.status(200).json({ userToReturn });


// });

// router.post("/register", async (req, res) => {
//     const { email, password,name, username } = req.body;
//     const user = await User.findOne({ email: email });
//     if (user) {
//         return res
//             .status(403)
//             .json({ error: "A user with this email alredy exist" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUserData = { email, password: hashedPassword, username, name };
//     const newUser = await User.create(newUserData);

//     const token = getToken(email, newUser);
//     const userToReturn = { ...newUserData.toJSON(), token };
//     delete userToReturn.password;
//     return res.status(200).json({ userToReturn });
// });




router.post('/register', async (req, res) => {

    //this code is run when  the /register  api is called    as post request

    const { email, password, name, username } = req.body;

    //step 2: dose a user with this email exist if yse throw an error  

    const user = User.findOne({ email: email });
    if (user) {
        //403 series of numberas  are user in authontication 
        return res
            .status(403)
            .json({
                error: "A user with this email already exists"
            });
    }



    //step 3:create a new user in the database
    //we do not store password in plane text we store in hashed password

    const hashedPassword = bcrypt.hash(password, 10);

    const newUserData = {
        email: email,
        password: hashedPassword,
        name: name,
        username: username
    };

    const newUser = await User.create(newUserData);

    //step 4: we want to create tokene to return to the user
    const token = await getToken(email, newUser);

    //step 5: we need to return the result to the user

    const userToReturn = { ...newUser.toJSON(), token };

    delete userToReturn.password;
    //200 is used as success message
    return res.status(200).json(userToReturn);

})
















//------------------------Login Router------------------------

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
