const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const { rootRouter } = require("./routes/router")
const { connectDB } = require("./config/connectDB")
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config()
const path = require('path');
const server = http.createServer(app);
const io = socketIo(server); // Attach socket.io to the server

// Phục vụ các file tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(bodyParser.json())
//alow cors
app.use(cors())
connectDB()
app.use("/api/v1", rootRouter);

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    // Example: Sending a welcome message to the connected client
    socket.emit('welcome', { message: 'Welcome to the WebSocket server!' });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

app.listen(process.env.PORT, () => {
    console.log("Server Run On Port: http://localhost:" + process.env.PORT);
})
