const express = require('express')
const { authRouter } = require("./authRoutes")
const { chatRouter } = require("./chat")
const { verifyToken } = require('../middleware/authMiddleware')
const rootRouter = express.Router()

rootRouter.use('/user', authRouter)
rootRouter.use('/chat', chatRouter)
module.exports = {
    rootRouter
}
