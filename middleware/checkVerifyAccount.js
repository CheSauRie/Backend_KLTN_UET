/**
 *  Kiểm tra user đã được verify chưa kiểm tra trường isVerified trong csdl
 * */

const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Đường dẫn đến file model User của bạn
require('dotenv').config({ path: '../.env' })
const checkIsVerified = async (req, res, next) => {
    const token = req.header("token");

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { user_id: decoded.id } });

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (!user.isVerified) {
            return res.status(403).send("User is not verified");
        }

        // Gán thông tin user vào req để sử dụng ở các middleware/hàm tiếp theo
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }
};

module.exports = { checkIsVerified };