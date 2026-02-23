
import { useState, useRuntimeConfig } from '#imports'
import { useBookingStore } from '@/stores/booking'
import { useRouter } from 'vue-router'
import { useBookingTimer } from '@/composables/useBookingTimer'
import { useRealtime } from '@/composables/useRealtime'

export const useBookingSubmit = () => {
    const store = useBookingStore()
    const router = useRouter()
    const config = useRuntimeConfig()
    const { clearTimer } = useBookingTimer()
    const { disconnect } = useRealtime()
    
    // State for the submission process
    const status = useState('booking-status', () => 'idle') // idle, loading, success, error
    const error = useState('booking-error', () => null)

    const submitBooking = async (customerName, customerEmail) => {
        if (store.selectedSeats.length === 0) {
            error.value = "No seats selected"
            return
        }
        
        if (!customerName || !customerEmail) {
            error.value = "Name and email are required"
            return
        }

        status.value = 'loading'
        error.value = null

        try {
            const payload = {
                session_id: store.currentSession?.id || 1,
                seats: store.selectedSeats.map(seat => seat.id),
                name: customerName,
                email: customerEmail,
                movie: store.currentMovie ? {
                    id: store.currentMovie.id || store.currentMovie.external_id || Math.floor(Math.random() * 1000),
                    title: store.currentMovie.title || store.currentMovie.name,
                    poster_url: store.currentMovie.poster || store.currentMovie.posterUrl || store.currentMovie.image,
                    duration_min: store.currentMovie.duration ? parseInt(store.currentMovie.duration) : 120
                } : null,
                total_price: store.grandTotal
            }
            
            console.log("Booking payload:", payload)

            const response = await $fetch(`${config.public.apiBase || '/api'}/bookings`, {
                method: 'POST',
                body: payload
            })

            status.value = 'success'
            clearTimer() // Clear the countdown timer
            
            // Disconnect from realtime server to free up queue slot
            disconnect()
            
            // Navigate to confirmation
            const parsedResponse = response.data || response;
            const bookingId = parsedResponse.id || Math.random().toString(36).substring(7)
            
            // Clear store BEFORE navigation so that any quick double-clicks find an empty store and bounce
            store.clearBooking()

            // Navigate away
            router.push(`/booking/${bookingId}-confirmation`)
            
            setTimeout(() => {
                status.value = 'idle'
            }, 1000)

        } catch (e) {
            status.value = 'error'
            // Extract meaningful message from Laravel's 409 or 422 if possible
            if (e.response && e.response._data && e.response._data.message) {
                error.value = e.response._data.message;
            } else {
                error.value = e.message || "Booking failed. Please try again."
            }
            console.error("Booking error:", e)
        }
    }

    return {
        submitBooking,
        status,
        error
    }
}
