const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        socket.join(data);
        const clients = io.sockets.adapter.rooms.get(data);
        const numOfClient = clients ? clients.size : 0;
        const foodTopArg = Math.floor(Math.random() * 10) * 5;
        const foodLeftArg = Math.floor(Math.random() * 10) * 5;
        let food = {top: 45, left: 45};
        socket.emit("receive_message", {numOfClient, food});
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("send_place", (data) => {
        socket.to(data.room).emit("receive_place", data);
    })

    socket.on("send_food_place", (data) => {
        socket.to(data.room).emit("receive_food_place", data);
    })

    socket.on("send_gameOver", (data) => {
        socket.to(data.room).emit("receive_gameOver", data);
    })
});

server.listen(3001, () => {
    console.log(`SERVER IS RUNNING ON PORT ${3001}`);
});