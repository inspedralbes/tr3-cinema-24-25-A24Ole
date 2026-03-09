const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Importaciones de módulos modularizados
const adminRoutes = require('./rutas/admin');
const setupSocketEvents = require('./sockets/eventos');

const app = express();
app.use(cors());

// Registro de rutas HTTP
app.use('/admin', adminRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://cinema.daw.inspedralbes.cat", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

// Configuración de eventos de WebSockets
setupSocketEvents(io);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Realtime server running on port ${PORT}`);
});