const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let tickets = [];
let currentTicket = null;

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.emit('current-ticket', currentTicket);
    socket.emit('ticket-list', tickets);

    socket.on('next-ticket', () => {
        const newTicket = {
            number: tickets.length + 1,
            time: new Date().toLocaleTimeString(),
        };
        tickets.push(newTicket);
        currentTicket = newTicket;
        io.emit('current-ticket', currentTicket);
        io.emit('ticket-list', tickets.slice(-3));
        io.emit('ticket-count', tickets.length);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
