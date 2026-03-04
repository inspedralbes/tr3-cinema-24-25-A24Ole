const { rooms } = require('../estado');
const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes

function unlockSeat(io, roomId, seatId) {
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

function handleLockSeat(io, socket, roomId, seatId) {
    const room = rooms.get(roomId);
    if (!room || !room.activeUsers.has(socket.id)) return; // Only active users can lock

    if (room.lockedSeats.has(seatId)) {
        socket.emit('error:locked', { seatId, message: 'Seat already locked' });
        return;
    }

    // Lock the seat
    const timeoutId = setTimeout(() => unlockSeat(io, roomId, seatId), LOCK_TIMEOUT);
    room.lockedSeats.set(seatId, { 
        socketId: socket.id, 
        timestamp: Date.now(),
        timeoutId 
    });

    // Broadcast to everyone in the room (including sender for confirmation)
    io.to(roomId).emit('seat:locked', seatId);
    console.log(`[Room ${roomId}] Seat ${seatId} locked by ${socket.id}`);
}

function handleUnlockSeat(io, socket, roomId, seatId) {
    const room = rooms.get(roomId);
    if (!room) return;

    const lock = room.lockedSeats.get(seatId);
    if (lock && lock.socketId === socket.id) {
        unlockSeat(io, roomId, seatId);
    }
}

function handlePurchaseSeats(io, socket, roomId, seatIds) {
    const room = rooms.get(roomId);
    if (!room || !Array.isArray(seatIds)) return;
    
    seatIds.forEach(seatId => {
        const lock = room.lockedSeats.get(seatId);
        // Only the owner can mark it as purchased 
        if (lock && lock.socketId === socket.id) {
            clearTimeout(lock.timeoutId);
            room.lockedSeats.delete(seatId); // Stop tracking it as a temporary lock
            io.to(roomId).emit('seat:purchased', seatId);
            console.log(`[Room ${roomId}] Seat ${seatId} purchased by ${socket.id}`);
        }
    });
}

function handleDisconnectSeats(io, socket, roomId) {
    const room = rooms.get(roomId);
    if (!room) return;

    // Release locks held by this user in this room
    for (const [seatId, lock] of room.lockedSeats.entries()) {
        if (lock.socketId === socket.id) {
            unlockSeat(io, roomId, seatId);
        }
    }
}

module.exports = {
    handleLockSeat,
    handleUnlockSeat,
    handlePurchaseSeats,
    handleDisconnectSeats
};
