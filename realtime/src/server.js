const { Server } = require("socket.io");
const http = require("http");

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // En producción, pon aquí la URL de tu Vue (ej: http://localhost:5173)
    methods: ["GET", "POST"]
  }
});

// Estado en memoria (Temporal para las 3 semanas)
const activeUsers = new Set(); // IDs de sockets dentro comprando
const queue = [];              // Sockets esperando
const blockedSeats = {};       // { "session_1": { "seat_A1": { userId, expiresAt } } }

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado:", socket.id);

  // --- LÓGICA DE COLA VIRTUAL ---
  socket.on("request_access", () => {
    if (activeUsers.size < 5) {
      activeUsers.add(socket.id);
      socket.emit("access_granted");
    } else {
      queue.push(socket.id);
      socket.emit("queue_position", { position: queue.indexOf(socket.id) + 1 });
    }
  });

  // --- LÓGICA DE BLOQUEO DE ASIENTOS ---
  socket.on("seat_click", ({ sessionId, seatId }) => {
    // 1. Verificar si ya está bloqueado por otro
    if (blockedSeats[sessionId]?.[seatId]) {
      return socket.emit("seat_error", "Asiento ya bloqueado");
    }

    // 2. Bloquear asiento
    if (!blockedSeats[sessionId]) blockedSeats[sessionId] = {};
    blockedSeats[sessionId][seatId] = { 
      userId: socket.id, 
      expiresAt: Date.now() + 5 * 60 * 1000 
    };

    // 3. Notificar a TODOS los demás
    io.emit("seat_blocked", { sessionId, seatId, userId: socket.id });
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.id);
    // Sacar de la cola si estaba ahí
    const index = queue.indexOf(socket.id);
    if (index > -1) queue.splice(index, 1);
    
    // Si un espacio se libera, dar paso al siguiente de la cola
    if (activeUsers.size < 5 && queue.length > 0) {
      const nextSocketId = queue.shift();
      io.to(nextSocketId).emit("access_granted");
      activeUsers.add(nextSocketId);
    }
    
    console.log("Usuario desconectado");
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor Realtime corriendo en puerto ${PORT}`);
});