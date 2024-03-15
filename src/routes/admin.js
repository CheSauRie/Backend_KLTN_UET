const express = require('express')

const routerAdmin = express.Router()

routerAdmin.get("/", (req, res) => {
    res.send("hello admin")
})

module.exports.routerAdmin = routerAdmin
