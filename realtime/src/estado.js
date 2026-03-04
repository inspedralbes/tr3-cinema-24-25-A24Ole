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

module.exports = {
    rooms,
    getRoomState
};
