const express = require('express')
const { authRouter } = require("./authRoutes")
const { chatRouter } = require("./chat")
const { uniRouter } = require("./university")
const { majorRouter } = require("./major")
const { verifyToken } = require('../middleware/authMiddleware')
const rootRouter = express.Router()

rootRouter.use('/user', authRouter)
rootRouter.use('/chat', chatRouter)
rootRouter.use("/admin", uniRouter)
rootRouter.use("/admin", majorRouter)
module.exports = {
    rootRouter
}
