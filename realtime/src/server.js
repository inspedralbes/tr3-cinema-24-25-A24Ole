const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev
        methods: ["GET", "POST"]
    }
});

const MAX_ACTIVE_USERS = 4;
const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// State tracking per room
// Map key: roomId. Value: { activeUsers: Set, queue: Array, lockedSeats: Map }
const rooms = new Map();

function getRoomState(roomId) {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, {
            activeUsers: new Set(),
            queue: [],
            lockedSeats: new Map() // seatId -> { socketId, timestamp, timeoutId }
        });
    }
    return rooms.get(roomId);
}

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
    if (room.activeUsers.size < MAX_ACTIVE_USERS) {
        room.activeUsers.add(socket.id);
        socket.emit('access:granted', {
            activeUsers: Array.from(room.activeUsers).filter(id => id !== socket.id)
        });
        console.log(`[Room ${roomId}] User ${socket.id} admitted. Active: ${room.activeUsers.size}`);
    } else {
        room.queue.push(socket.id);
        socket.emit('access:queued', { position: room.queue.length });
        console.log(`[Room ${roomId}] User ${socket.id} queued. Position: ${room.queue.length}`);
    }

    // --- Seat Locking ---
    // Initial state for this room
    socket.emit('seats:update', Array.from(room.lockedSeats.keys()));

    socket.on('request:lock', (seatId) => {
        if (!room.activeUsers.has(socket.id)) return; // Only active users can lock

        if (room.lockedSeats.has(seatId)) {
            socket.emit('error:locked', { seatId, message: 'Seat already locked' });
            return;
        }

        // Lock the seat
        const timeoutId = setTimeout(() => unlockSeat(roomId, seatId), LOCK_TIMEOUT);
        room.lockedSeats.set(seatId, { 
            socketId: socket.id, 
            timestamp: Date.now(),
            timeoutId 
        });

        // Broadcast to everyone in the room (including sender for confirmation)
        io.to(roomId).emit('seat:locked', seatId);
        console.log(`[Room ${roomId}] Seat ${seatId} locked by ${socket.id}`);
    });

    socket.on('request:unlock', (seatId) => {
        const lock = room.lockedSeats.get(seatId);
        if (lock && lock.socketId === socket.id) {
            unlockSeat(roomId, seatId);
        }
    });

    // --- WebRTC Signaling ---
    // When a user is granted access, send them the list of other active users to initiate connections
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
        for (const [seatId, lock] of room.lockedSeats.entries()) {
            if (lock.socketId === socket.id) {
                unlockSeat(roomId, seatId);
            }
        }

        // 2. Manage Queue/Active Users
        if (room.activeUsers.has(socket.id)) {
            room.activeUsers.delete(socket.id);
            
            // Admit next from queue if available
            if (room.queue.length > 0) {
                const nextSocketId = room.queue.shift();
                room.activeUsers.add(nextSocketId);
                
                io.to(nextSocketId).emit('access:granted', {
                    activeUsers: Array.from(room.activeUsers).filter(id => id !== nextSocketId)
                });
                
                // Update remaining queue positions
                room.queue.forEach((sid, index) => {
                    io.to(sid).emit('queue:update', { position: index + 1 });
                });
                
                console.log(`[Room ${roomId}] User ${nextSocketId} promoted from queue.`);
            }
            
            // Cleanup empty room
            if (room.activeUsers.size === 0 && room.queue.length === 0 && room.lockedSeats.size === 0) {
                rooms.delete(roomId);
                console.log(`[Room ${roomId}] Cleaned up empty room`);
                return;
            }
            
        } else {
            // Remove from queue if they were waiting
            const index = room.queue.indexOf(socket.id);
            if (index !== -1) {
                room.queue.splice(index, 1);
                // Update positions only for those behind
                for (let i = index; i < room.queue.length; i++) {
                    io.to(room.queue[i]).emit('queue:update', { position: i + 1 });
                }
            }
        }
        
        console.log(`[Room ${roomId}] Active: ${room.activeUsers.size}, Queue: ${room.queue.length}`);
    });
});

function unlockSeat(roomId, seatId) {
    const room = rooms.get(roomId);
    if (!room) return;
    
    const lock = room.lockedSeats.get(seatId);
    if (lock) {
        clearTimeout(lock.timeoutId);
        room.lockedSeats.delete(seatId);
        io.to(roomId).emit('seat:unlocked', seatId);
        console.log(`[Room ${roomId}] Seat ${seatId} unlocked (Timeout or Release)`);
    }
}

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Realtime server running on port ${PORT}`);
});