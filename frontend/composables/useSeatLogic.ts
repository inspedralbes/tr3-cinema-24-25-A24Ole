import { useBookingStore } from '@/stores/booking'
import { useRealtime } from '@/composables/useRealtime' // JS
import type { Seat } from '@/types'

export function useSeatLogic() {
  const bookingStore = useBookingStore()
  // @ts-ignore
  const { lockSeat, unlockSeat } = useRealtime()

  const toggleSeat = (seat: Seat) => {
    // Check if locked by others (handled in component/store usually, but here we handle OUR strict selection)
    
    if (bookingStore.selectedSeats.some(s => s.id === seat.id)) {
        // Unselecting
        unlockSeat(seat.id)
        bookingStore.toggleSeat(seat)
    } else {
        // Selecting
        lockSeat(seat.id)
        bookingStore.toggleSeat(seat) // Store handles max seats check
    }
  }

  return {
    toggleSeat
  }
}
