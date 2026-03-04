const { getRoomState } = require('../estado');
const colas = require('../servicios/colas');
const asientos = require('../servicios/asientos');

function setupSocketEvents(io) {
    io.on('connection', (socket) => {
        const roomId = socket.handshake.query.roomId;
        
        if (!roomId) {
            console.log(`Connection rejected: no roomId [${socket.id}]`);
            socket.disconnect(true);
            return;
        }

        console.log(`User connected: ${socket.id} to room ${roomId}`);
        socket.join(roomId);
        
        const room = getRoomState(roomId);

        // --- Queue Management ---
        colas.handleUserQueue(io, socket, roomId, room);

        // --- Seat Locking ---
        // Initial state for this room
        socket.emit('seats:update', Array.from(room.lockedSeats.keys()));

        socket.on('request:lock', (seatId) => {
            asientos.handleLockSeat(io, socket, roomId, seatId);
        });

        socket.on('request:unlock', (seatId) => {
            asientos.handleUnlockSeat(io, socket, roomId, seatId);
        });

        socket.on('request:purchase', (seatIds) => {
            asientos.handlePurchaseSeats(io, socket, roomId, seatIds);
        });

        // --- WebRTC Signaling ---
        socket.on('signal', (data) => {
            io.to(data.to).emit('signal', {
                signal: data.signal,
                from: socket.id
            });
        });

        // --- Disconnect Handling ---
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id} from room ${roomId}`);
            
            // Notify others in room to destroy peer connection
            socket.to(roomId).emit('user-disconnected', socket.id);

            // 1. Release locks held by this user in this room
            asientos.handleDisconnectSeats(io, socket, roomId);

            // 2. Manage Queue/Active Users
            colas.handleDisconnectQueue(io, socket, roomId);
        });
    });
}

module.exports = setupSocketEvents;
