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

const MAX_ACTIVE_USERS = 5;
const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// State
let activeUsers = new Set();
let queue = [];
let lockedSeats = new Map(); // seatId -> { socketId, timestamp, timeoutId }

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // --- Queue Management ---
    if (activeUsers.size < MAX_ACTIVE_USERS) {
        activeUsers.add(socket.id);
        socket.emit('access:granted', {
            activeUsers: Array.from(activeUsers).filter(id => id !== socket.id)
        });
        console.log(`User ${socket.id} admitted. Active: ${activeUsers.size}`);
    } else {
        queue.push(socket.id);
        socket.emit('access:queued', { position: queue.length });
        console.log(`User ${socket.id} queued. Position: ${queue.length}`);
    }

    // --- Seat Locking ---
    // Initial state
    socket.emit('seats:update', Array.from(lockedSeats.keys()));

    socket.on('request:lock', (seatId) => {
        if (!activeUsers.has(socket.id)) return; // Only active users can lock

        if (lockedSeats.has(seatId)) {
            socket.emit('error:locked', { seatId, message: 'Seat already locked' });
            return;
        }

        // Lock the seat
        const timeoutId = setTimeout(() => unlockSeat(seatId), LOCK_TIMEOUT);
        lockedSeats.set(seatId, { 
            socketId: socket.id, 
            timestamp: Date.now(),
            timeoutId 
        });

        // Broadcast to everyone (including sender for confirmation)
        io.emit('seat:locked', seatId);
        console.log(`Seat ${seatId} locked by ${socket.id}`);
    });

    socket.on('request:unlock', (seatId) => {
        const lock = lockedSeats.get(seatId);
        if (lock && lock.socketId === socket.id) {
            unlockSeat(seatId);
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
        console.log('User disconnected:', socket.id);
        
        // Notify others to destroy peer connection
        socket.broadcast.emit('user-disconnected', socket.id);

        // 1. Release locks held by this user
        for (const [seatId, lock] of lockedSeats.entries()) {
            if (lock.socketId === socket.id) {
                unlockSeat(seatId);
            }
        }

        // 2. Manage Queue/Active Users
        if (activeUsers.has(socket.id)) {
            activeUsers.delete(socket.id);
            
            // Admit next from queue if available
            if (queue.length > 0) {
                const nextSocketId = queue.shift();
                activeUsers.add(nextSocketId);
                
                io.to(nextSocketId).emit('access:granted', {
                    activeUsers: Array.from(activeUsers).filter(id => id !== nextSocketId)
                });
                
                // Update remaining queue positions
                queue.forEach((sid, index) => {
                    io.to(sid).emit('queue:update', { position: index + 1 });
                });
                
                console.log(`User ${nextSocketId} promoted from queue.`);
            }
        } else {
            // Remove from queue if they were waiting
            const index = queue.indexOf(socket.id);
            if (index !== -1) {
                queue.splice(index, 1);
                // Update positions only for those behind
                for (let i = index; i < queue.length; i++) {
                    io.to(queue[i]).emit('queue:update', { position: i + 1 });
                }
            }
        }
        
        console.log(`Active: ${activeUsers.size}, Queue: ${queue.length}`);
    });
});

function unlockSeat(seatId) {
    const lock = lockedSeats.get(seatId);
    if (lock) {
        clearTimeout(lock.timeoutId);
        lockedSeats.delete(seatId);
        io.emit('seat:unlocked', seatId);
        console.log(`Seat ${seatId} unlocked (Timeout or Release)`);
    }
}

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Realtime server running on port ${PORT}`);
});