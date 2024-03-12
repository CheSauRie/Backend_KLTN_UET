// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const authRouter = express.Router();
const { register, login, emailVerify, requestPasswordReset, resetPassword, changePassword } = require('../controller/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Đăng ký
authRouter.post('/register', register);

// Xác minh email
authRouter.get('/verify-email', emailVerify);

// Đăng nhập
authRouter.post('/login', login);

// Yêu cầu đặt lại mật khẩu
authRouter.post('/request-reset-password', requestPasswordReset);

// Đặt lại mật khẩu
authRouter.post('/reset-password', resetPassword);

// Thay đổi mật khẩu
authRouter.post("/change-password", verifyToken, changePassword)
module.exports = {
    authRouter
};
