import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useRouter, useRuntimeConfig } from '#imports'

// Singleton state
const socket = ref(null)
const isConnected = ref(false)
const isConnecting = ref(true) // Loading state for initial fetch
const lockedSeats = ref(new Set()) // Set of seat IDs
const queuePosition = ref(null)
const startTransition = ref(false) // Trigger for waiting room exit
const activeUsers = ref([])
const currentRoomId = ref(null)

export const useRealtime = () => {
  const config = useRuntimeConfig()
  // Ensure we use the correct URL. In dev it might be localhost:3002
  const SOCKET_URL = 'http://localhost:3002' 
  const router = useRouter()

  const connect = async (roomId) => {
    if (socket.value?.connected) {
        if (currentRoomId.value === roomId) {
            isConnecting.value = false;
            return;
        } else {
            socket.value.disconnect()
            socket.value = null
        }
    }
    
    if (!roomId) {
        console.error('Realtime connection requires a roomId')
        return
    }

    if (currentRoomId.value !== roomId) {
        lockedSeats.value.clear()
        lockedSeats.value = new Set()
        activeUsers.value = []
        queuePosition.value = null
    }

    currentRoomId.value = roomId
    isConnecting.value = true

    // Fetch permanently occupied seats from backend DB before connecting to WS
    try {
        const res = await $fetch(`${config.public.apiBase || '/api'}/peliculas/${roomId}/asientos-ocupados`)
        if (res && res.data) {
            // DB returns strings, SeatMap uses numbers. Force Number coercion for strict equality in Set
            res.data.forEach(seatId => lockedSeats.value.add(Number(seatId)))
            // Trigger Vue Reactivity manually because Mutating a ref(Set) directly doesn't 
            lockedSeats.value = new Set(lockedSeats.value)
        }
    } catch (e) {
        console.error("Failed to fetch permanently occupied seats:", e)
    }

    socket.value = io(SOCKET_URL, {
        transports: ['websocket'],
        query: { roomId },
        autoConnect: true
    })

    socket.value.on('connect', () => {
        isConnected.value = true
        console.log('Socket connected:', socket.value.id)
    })

    socket.value.on('connect_error', (err) => {
        console.warn('Socket connection error (Check if realtime server is running):', err.message)
    })

    socket.value.on('disconnect', () => {
        isConnected.value = false
        console.log('Socket disconnected')
    })

    // --- Queue Events ---
    socket.value.on('access:granted', (data) => {
        queuePosition.value = null
        startTransition.value = true
        if (data && data.activeUsers) {
            activeUsers.value = data.activeUsers
        }
    })

    socket.value.on('access:queued', (data) => {
        queuePosition.value = data.position
        // Redirect to waiting room if not already there
        if (router.currentRoute.value.path !== '/waiting-room') {
            router.push('/waiting-room')
        }
    })

    socket.value.on('queue:update', (data) => {
        queuePosition.value = data.position
    })

    // --- Seat Events ---
    socket.value.on('seats:update', (seats) => {
        const numSeats = seats.map(id => Number(id))
        lockedSeats.value = new Set([...lockedSeats.value, ...numSeats])
    })

    socket.value.on('seat:locked', (seatId) => {
        lockedSeats.value.add(Number(seatId)) 
        // Force reactivity update for Set methods if needed, or create new Set
        lockedSeats.value = new Set(lockedSeats.value)
    })

    socket.value.on('seat:unlocked', (seatId) => {
        lockedSeats.value.delete(Number(seatId))
        lockedSeats.value = new Set(lockedSeats.value)
    })

    socket.value.on('seat:purchased', (seatId) => {
        lockedSeats.value.add(Number(seatId)) // ensure it's still locked for others visually
        lockedSeats.value = new Set(lockedSeats.value)
    })

    socket.value.on('error:locked', (data) => {
        alert(data.message)
    })

    // Turn off loading once socket is setup
    isConnecting.value = false;
  }

  const disconnect = () => {
    if (socket.value) {
        socket.value.disconnect()
        socket.value = null
    }
  }

  const lockSeat = (seatId) => {
    if (!socket.value) return
    socket.value.emit('request:lock', seatId)
  }

  const unlockSeat = (seatId) => {
    if (!socket.value) return
    socket.value.emit('request:unlock', seatId)
  }

  const purchaseSeats = (seatIds) => {
    if (!socket.value) return
    socket.value.emit('request:purchase', seatIds)
  }

  return {
    socket,
    isConnected,
    isConnecting,
    lockedSeats,
    queuePosition,
    startTransition,
    connect,
    disconnect,
    lockSeat,
    unlockSeat,
    purchaseSeats,
    activeUsers
  }
}
