const express = require('express');
const router = express.Router();
const { rooms } = require('../estado');

// Helper to get room states for admin
router.get('/state', (req, res) => {
    let totalConnected = 0;
    let totalLocked = 0;
    let totalQueued = 0;
    
    // Convert rooms map to array for easier consumption
    const roomsData = Array.from(rooms.entries()).map(([roomId, room]) => {
        totalConnected += room.activeUsers.size;
        totalQueued += room.queue.length;
        totalLocked += room.lockedSeats.size;
        
        return {
            roomId,
            activeUsers: room.activeUsers.size,
            queuedUsers: room.queue.length,
            lockedSeats: room.lockedSeats.size
        };
    });

    res.json({
        global: {
            totalConnected,
            totalQueued,
            totalLocked
        },
        rooms: roomsData
    });
});

module.exports = router;
