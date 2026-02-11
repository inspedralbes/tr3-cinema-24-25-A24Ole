import { ref } from 'vue'
import SimplePeer from 'simple-peer'

// Global state to share across components if needed, 
// though typically we might want this per-view. 
// For now, let's keep it local to the function or use a singleton pattern if we want persistence.
// Given strict setup, let's return a new instance state but rely on the passed socket.

export const useWebRTC = (socket) => {
    const peers = new Map() // socketId -> SimplePeer
    const cursors = ref(new Map()) // socketId -> { x, y }

    const createPeer = (userToSignal, callerID, initiator) => {
        const peer = new SimplePeer({
            initiator: initiator,
            trickle: false
        })

        peer.on('signal', signal => {
            socket.value.emit('signal', {
                to: userToSignal,
                signal: signal
            })
        })

        peer.on('data', data => {
            try {
                const decoder = new TextDecoder()
                const text = decoder.decode(data)
                const parsed = JSON.parse(text)
                
                if (parsed.type === 'cursor') {
                    cursors.value.set(userToSignal, parsed.position)
                }
            } catch (e) {
                console.error('Error parsing WebRTC data', e)
            }
        })

        peer.on('connect', () => {
            console.log(`WebRTC Peer Connected: ${userToSignal}`)
        })

        return peer
    }

    const initWebRTC = (activeUsers) => {
        // We are the initiator for existing users
        activeUsers.forEach(userId => {
            const peer = createPeer(userId, socket.value.id, true)
            peers.set(userId, peer)
        })
    }

    const handleSignal = (data) => {
        const senderID = data.from
        let peer = peers.get(senderID)

        if (!peer) {
            // We are the receiver
            peer = createPeer(senderID, socket.value.id, false)
            peers.set(senderID, peer)
        }

        peer.signal(data.signal)
    }

    const handleUserDisconnected = (userId) => {
        if (peers.has(userId)) {
            peers.get(userId).destroy()
            peers.delete(userId)
        }
        cursors.value.delete(userId)
    }

    const bindEvents = () => {
        if (!socket.value) return
        
        socket.value.on('signal', handleSignal)
        socket.value.on('user-disconnected', handleUserDisconnected)
        
        // Also listen for access:granted to get initial users if we just joined?
        // Actually, access:granted is handled in useRealtime, we need to pass that data here.
    }
    
    const sendCursorUpdate = (x, y) => {
        const data = JSON.stringify({ type: 'cursor', position: { x, y } })
        for (const peer of peers.values()) {
            if (peer.connected) {
                peer.send(data)
            }
        }
    }
    
    const cleanup = () => {
        peers.forEach(p => p.destroy())
        peers.clear()
        cursors.value.clear()
        
        if (socket.value) {
            socket.value.off('signal', handleSignal)
            socket.value.off('user-disconnected', handleUserDisconnected)
        }
    }

    return {
        initWebRTC,
        bindEvents,
        cleanup,
        sendCursorUpdate,
        cursors
    }
}
