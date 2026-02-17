
import { useState, useRuntimeConfig } from '#imports'
import { useBookingStore } from '@/stores/booking'
import { useRouter } from 'vue-router'

export const useBookingSubmit = () => {
    const store = useBookingStore()
    const router = useRouter()
    const config = useRuntimeConfig()
    
    // State for the submission process
    const status = useState('booking-status', () => 'idle') // idle, loading, success, error
    const error = useState('booking-error', () => null)

    const submitBooking = async () => {
        if (store.selectedSeats.length === 0) {
            error.value = "No seats selected"
            return
        }

        status.value = 'loading'
        error.value = null

        try {
            const payload = {
                session_id: store.currentSession?.id || 1,
                seats: store.selectedSeats.map(seat => seat.id)
            }
            
            console.log("Booking payload:", payload)

            const response = await $fetch(`${config.public.apiBase || '/api'}/bookings`, {
                method: 'POST',
                body: payload
            })

            // On success, response contains the data directly
            const data = ref(response) 
            const fetchError = ref(null) // $fetch throws on error, so we catch it in the catch block

            if (fetchError.value) {
                throw new Error(fetchError.value.message || 'Booking failed')
            }

            status.value = 'success'
            // Navigate to confirmation
            const bookingId = data.value?.id || Math.random().toString(36).substring(7)
            router.push(`/booking/${bookingId}-confirmation`)
            
            // Clear store after successful navigation
            setTimeout(() => {
                store.clearBooking()
                status.value = 'idle'
            }, 500)

        } catch (e) {
            status.value = 'error'
            error.value = e.message
            console.error("Booking error:", e)
        }
    }

    return {
        submitBooking,
        status,
        error
    }
}
