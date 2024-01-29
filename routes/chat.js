// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const chatRouter = express.Router();
const { responseAI, getChat, createChat, deleteChat, getDetailMessage, createMessage } = require("../controller/chatController")
const { verifyToken } = require("../middleware/authMiddleware")
chatRouter.post('/', responseAI);
chatRouter.get('/get-chat', verifyToken, getChat)
chatRouter.post("/create-chat", verifyToken, createChat)
chatRouter.delete('/delete-chat', verifyToken, deleteChat)
chatRouter.get('/detail-message', getDetailMessage)
chatRouter.post('/create-message', createMessage)
module.exports = {
    chatRouter
};
