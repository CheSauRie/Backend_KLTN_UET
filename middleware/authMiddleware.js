const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' })
const verifyToken = (req, res, next) => {
    const token = req.header("token")
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = { verifyToken };
