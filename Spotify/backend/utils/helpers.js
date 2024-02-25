const jwt = require('jsonwebtoken');
exports = {};

exports.getToken = async (email, user) => {
    const token = jwt.sign(
        { identifier: user._id },
        process.env.SECRET, { expiresIn:"1h" }
    );
    //console.log("helper.js file" + user._id, token);
    return token;
};

module.exports = exports;
