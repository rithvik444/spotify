// router.post('/register', async (req, res) => {
//     const { email, password, name, username } = req.body;

//     try {
//         // Check if a user with this email already exists
//         const existingUser = await User.findOne({ email: email, password: password });
//         if (existingUser) {
//             return res.status(403).json({ error: "A user with this email already exists" });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user in the database
//         const newUser = await User.create({
//             email: email,
//             password: hashedPassword,
//             name: name,
//             username: username
//         });

//         // Create a token for the user
//         const token = await getToken(email, newUser);

//         // Return the result to the user
//         const userToReturn = { ...newUser.toJSON(), token };
//         delete userToReturn.password;

//         return res.status(200).json(userToReturn);
//     } catch (error) {
//         console.error("Error during user registration:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// });


//---------------------

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