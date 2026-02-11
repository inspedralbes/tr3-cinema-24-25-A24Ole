import { useBookingStore } from '@/stores/booking'
import { useRealtime } from '@/composables/useRealtime'

export function useSeatLogic() {
  const bookingStore = useBookingStore()
  const { lockSeat, unlockSeat } = useRealtime()

  const toggleSeat = (seat) => {
    if (bookingStore.selectedSeats.some(s => s.id === seat.id)) {
        // Unselecting
        unlockSeat(seat.id)
        bookingStore.toggleSeat(seat)
    } else {
        // Selecting
        lockSeat(seat.id)
        bookingStore.toggleSeat(seat)
    }
  }

  return {
    toggleSeat
  }
}
