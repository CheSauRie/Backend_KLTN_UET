// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const chatRouter = express.Router();
const { responseAI } = require("../controller/chatController")

chatRouter.post('/', responseAI);
module.exports = {
    chatRouter
};
