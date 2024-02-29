const express = require('express')
const { authRouter } = require("./authRoutes")
const { chatRouter } = require("./chat")
const { uniRouter } = require("./university")
const { majorRouter } = require("./major")
const { reviewRouter } = require('./review')
const { consultationRouter } = require("./consultation")
const rootRouter = express.Router()

rootRouter.use('/user', authRouter)
rootRouter.use('/chat', chatRouter)
rootRouter.use("/admin", uniRouter)
rootRouter.use("/admin", majorRouter)
rootRouter.use('/user', reviewRouter)
rootRouter.use('/user', consultationRouter)
module.exports = {
    rootRouter
}
