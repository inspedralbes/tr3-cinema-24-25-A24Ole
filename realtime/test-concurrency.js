const { io } = require("socket.io-client");

const URL = "http://localhost:3002";
const CLIENT_COUNT = 7; // Should exceed MAX_ACTIVE_USERS (5)
const clients = [];

console.log(`Starting ${CLIENT_COUNT} clients...`);

for (let i = 0; i < CLIENT_COUNT; i++) {
    const socket = io(URL, {
        transports: ['websocket'],
        autoConnect: false
    });

    socket.auth = { userId: `user-${i}` };
    
    socket.on("connect", () => {
        console.log(`Client ${i} connected [${socket.id}]`);
    });

    socket.on("access:granted", (data) => {
        console.log(`✅ Client ${i} GRANTED access. Active Users: ${data?.activeUsers?.length || '?'}`);
        
        // Simulate behavior for active users
        if (i === 0) {
            console.log(`🔒 Client ${i} locking seat A1...`);
            socket.emit("request:lock", "A1");
        }
    });

    socket.on("access:queued", (data) => {
        console.log(`⏳ Client ${i} QUEUED at position ${data.position}`);
    });

    socket.on("seat:locked", (seatId) => {
        console.log(`🔒 Event: Seat ${seatId} locked (received by Client ${i})`);
    });

    socket.on("seat:unlocked", (seatId) => {
        console.log(`🔓 Event: Seat ${seatId} unlocked (received by Client ${i})`);
    });
    
    socket.on("disconnect", () => {
        console.log(`Client ${i} disconnected`);
    });

    clients.push(socket);
    
    // Stagger connections slightly
    setTimeout(() => {
        socket.connect();
    }, i * 200);
}

// Simulate a disconnect to test queue promotion
setTimeout(() => {
    console.log("\n--- Simulating Disconnect of Active User (Client 0) ---\n");
    clients[0].disconnect();
}, 5000);
