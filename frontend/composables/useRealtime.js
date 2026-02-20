import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useRouter } from 'vue-router'

// Singleton state
const socket = ref(null)
const isConnected = ref(false)
const lockedSeats = ref(new Set()) // Set of seat IDs
const queuePosition = ref(null)
const startTransition = ref(false) // Trigger for waiting room exit
const activeUsers = ref([])

export const useRealtime = () => {
  // const config = useRuntimeConfig()
  // Ensure we use the correct URL. In dev it might be localhost:3002
  const SOCKET_URL = 'http://localhost:3002' 
  const router = useRouter()

  const connect = () => {
    if (socket.value?.connected) return

    socket.value = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true
    })

    socket.value.on('connect', () => {
        isConnected.value = true
        console.log('Socket connected:', socket.value.id)
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
        lockedSeats.value = new Set(seats)
    })

    socket.value.on('seat:locked', (seatId) => {
        lockedSeats.value.add(seatId) 
        // Force reactivity update for Set methods if needed, or create new Set
        lockedSeats.value = new Set(lockedSeats.value)
    })

    socket.value.on('seat:unlocked', (seatId) => {
        lockedSeats.value.delete(seatId)
        lockedSeats.value = new Set(lockedSeats.value)
    })

    socket.value.on('error:locked', (data) => {
        alert(data.message)
    })
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

  return {
    socket,
    isConnected,
    lockedSeats,
    queuePosition,
    startTransition,
    connect,
    disconnect,
    lockSeat,
    unlockSeat,
    activeUsers
  }
}
