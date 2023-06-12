import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/cluster-adapter";
import { setupWorker  } from "@socket.io/sticky";


const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.adapter(createAdapter());

setupWorker(io);

app.get('/', (req, res) => {
    res.sendFile("/home/socket_test/index.html");
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        socket.broadcast.emit('chat message', msg);
    });
});

server.listen(process.env.NODE_PORT || 3000, () => {
    console.log('listening on *:3000');
});
