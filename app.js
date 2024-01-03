const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const { rootRouter } = require("./routes/router")
const { connectDB } = require("./config/connectDB")
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
})
);
app.use(bodyParser.json())
//alow cors
app.use(cors())
connectDB()
app.use("/api/v1", rootRouter);

app.listen(process.env.PORT, () => {
    console.log("Server Run On Port: http://localhost:" + process.env.PORT);
})
