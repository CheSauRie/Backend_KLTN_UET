// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const authRouter = express.Router();
const { register, login, emailVerify, requestPasswordReset, resetPassword } = require('../controller/authController');

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
module.exports = {
    authRouter
};
