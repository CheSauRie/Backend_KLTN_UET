// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const authRouter = express.Router();
const { register, login } = require('../controller/authController');

authRouter.post('/register', register);
authRouter.post('/login', login)
module.exports = {
    authRouter
};
