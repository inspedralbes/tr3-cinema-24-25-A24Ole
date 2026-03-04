import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStorage } from '@vueuse/core'
import { useBookingStore } from '@/stores/booking'
import { useRouter } from 'vue-router'

export const useBookingTimer = () => {
    // 5 minutes in milliseconds
    const TIMER_DURATION = 5 * 60 * 1000

    // Store the expiration timestamp in localStorage using useStorage
    const expiresAt = useStorage('booking-expires-at', 0)
    
    // Local reactive state for the countdown (in seconds)
    const timeLeft = ref(0)
    let intervalId = null

    const store = useBookingStore()
    const router = useRouter()

    const calculateTimeLeft = () => {
        if (!expiresAt.value) return 0
        const now = Date.now()
        const diff = expiresAt.value - now
        return diff > 0 ? Math.floor(diff / 1000) : 0
    }

    const startTimer = () => {
        if (!expiresAt.value || expiresAt.value < Date.now()) {
            expiresAt.value = Date.now() + TIMER_DURATION
        }
        
        timeLeft.value = calculateTimeLeft()
        
        if (intervalId) clearInterval(intervalId)
        
        intervalId = setInterval(() => {
            // If another instance cleared the timer, just stop our interval and exit
            if (expiresAt.value === 0) {
                clearTimer()
                return
            }

            timeLeft.value = calculateTimeLeft()
            
            if (timeLeft.value <= 0) {
                handleExpiration()
            }
        }, 1000)
    }

    const clearTimer = () => {
        expiresAt.value = 0
        timeLeft.value = 0
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
        }
    }

    const handleExpiration = () => {
        clearTimer()
        store.clearBooking()
        alert('Your session has expired. The seats have been released.')
        
        // Redirect back to the seat map (assuming we have a session ID, if not, go home)
        const sessionId = store.currentMovie?.id_pelicula_api || store.currentMovie?.id || 1
        router.push(`/sesion/${sessionId}/asientos`)
    }

    const formattedTime = computed(() => {
        if (expiresAt.value === 0 && timeLeft.value === 0) return '00:00' // Show 00:00 if legitimately empty
        if (timeLeft.value <= 0 && expiresAt.value > 0) return '00:00' // Show 00:00 if expired natural
        
        // If it's effectively frozen (e.g. during checkout transition), cache the last known value visually
        const minutes = Math.floor(timeLeft.value / 60)
        const seconds = timeLeft.value % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    // Automatically manage timer lifecycle on mount/unmount
    onMounted(() => {
        // If there's an active timer in storage, resume it
        if (expiresAt.value && expiresAt.value > Date.now()) {
            startTimer()
        } else if (expiresAt.value !== 0 && expiresAt.value <= Date.now()) {
             // It expired while we were away
             handleExpiration()
        }
    })

    onUnmounted(() => {
        if (intervalId) {
            clearInterval(intervalId)
        }
    })

    return {
        startTimer,
        clearTimer,
        timeLeft,
        formattedTime,
        isActive: computed(() => expiresAt.value > Date.now())
    }
}
