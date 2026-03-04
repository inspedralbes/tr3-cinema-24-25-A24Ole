const { rooms } = require('../estado');
const MAX_ACTIVE_USERS = 4;

function handleUserQueue(io, socket, roomId, room) {
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
}

function promoteNextUser(io, roomId, room) {
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
}

function handleDisconnectQueue(io, socket, roomId) {
    const room = rooms.get(roomId);
    if (!room) return;

    if (room.activeUsers.has(socket.id)) {
        room.activeUsers.delete(socket.id);
        promoteNextUser(io, roomId, room);
        
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
}

module.exports = {
    handleUserQueue,
    promoteNextUser,
    handleDisconnectQueue
};
