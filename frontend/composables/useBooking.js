import { useBookingStore } from '@/stores/booking'
import { useRouter } from 'vue-router'

export const useBooking = () => {
    const store = useBookingStore()
    const router = useRouter()

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value)
    }

    const nextStep = (currentStep) => {
        const sessionId = store.currentMovie?.id_pelicula_api || store.currentMovie?.id || 1
        
        switch (currentStep) {
            case 'seats':
                if (store.selectedSeats.length === 0) {
                    alert('Please select at least one seat.')
                    return
                }
                router.push(`/showtime/${sessionId}/tickets`)
                break
            case 'tickets':
                // Verify all seats have ticket types
                const missingTickets = store.selectedSeats.some(seat => !store.selectedTickets[seat.id])
                if (missingTickets) {
                    alert('Please select a ticket type for all seats.')
                    return // Allow proceeding for now for demo? No, strict.
                }
                router.push(`/showtime/${sessionId}/checkout`)
                break
            case 'checkout':
                // Payment processing mock
                router.push(`/booking/${Math.random().toString(36).substring(7)}-confirmation`)
                break
        }
    }

    return {
        store,
        formatCurrency,
        nextStep
    }
}
