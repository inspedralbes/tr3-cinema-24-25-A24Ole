
import { useState, useRuntimeConfig } from '#imports'
import { useBookingStore } from '@/stores/booking'
import { useRouter, useRoute } from 'vue-router'
import { useBookingTimer } from '@/composables/useBookingTimer'
import { useRealtime } from '@/composables/useRealtime'

export const useBookingSubmit = () => {
    const store = useBookingStore()
    const router = useRouter()
    const route = useRoute()
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
                pelicula_id: route.params?.id || store.currentMovie?.id_pelicula_api || store.currentMovie?.id,
                seats: store.selectedSeats.map(seat => seat.id),
                name: customerName,
                email: customerEmail,
                movie: store.currentMovie ? {
                    id: store.currentMovie.id || store.currentMovie.external_id || store.currentMovie.id_pelicula_api || Math.floor(Math.random() * 1000),
                    title: store.currentMovie.titulo || store.currentMovie.title || store.currentMovie.name,
                    poster_url: store.currentMovie.poster_url || store.currentMovie.poster || store.currentMovie.image,
                    duration_min: store.currentMovie.duracion ? parseInt(store.currentMovie.duracion) : (store.currentMovie.duration ? parseInt(store.currentMovie.duration) : 120),
                    genre: store.currentMovie.genero || store.currentMovie.genre || 'Unknown',
                    description: store.currentMovie.descripcion || store.currentMovie.description || '',
                    year: store.currentMovie.año || store.currentMovie.year || 2026
                } : null,
                total_price: store.grandTotal
            }
            
            console.log("Booking payload:", payload)

            const response = await $fetch(`${config.public.apiBase || '/api'}/reservas`, {
                method: 'POST',
                body: payload
            })

            status.value = 'success'
            
            // Tell the realtime server these are bought, not just abandoned
            const { purchaseSeats } = useRealtime()
            purchaseSeats(payload.seats)
            
            // Give the emit a fraction of a second to travel over the websocket before disconnecting
            setTimeout(() => {
                disconnect()
            }, 100)
            
            // Navigate to confirmation
            const parsedResponse = response.data || response;
            const bookingId = parsedResponse.id || Math.random().toString(36).substring(7)
            
            // Navigate away first
            router.push(`/reserva/${bookingId}-confirmacion`)
            
            // Clear store and timer after a long enough delay so the transition finishes with data intact
            setTimeout(() => {
                clearTimer()
                store.clearBooking()
                status.value = 'idle'
            }, 1500)

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
