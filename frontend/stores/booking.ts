import { defineStore } from 'pinia'
import type { BookingState, Movie, Seat, Session, Ticket } from '@/types'

export const useBookingStore = defineStore('booking', {
  state: (): BookingState => ({
    currentMovie: null,
    currentSession: null,
    selectedSeats: [],
    selectedTickets: {},
    bookingFee: 1.25
  }),

  getters: {
    totalTicketPrice: (state): number => {
      let total = 0
      state.selectedSeats.forEach(seat => {
        const ticket = state.selectedTickets[seat.id]
        if (ticket) {
          total += ticket.price
        } else {
             // If no ticket type selected yet, assume 0 or base price?
             // Logic from JS file was 0.
            total += 0
        }
      })
      return total
    },
    totalBookingFee: (state): number => {
        return state.selectedSeats.length * state.bookingFee
    },
    grandTotal: (state): number => {
        let total = 0
        // Check if logic matches totalTicketPrice?
        // Old logic iterated values of selectedTickets. 
        // But what if a seat is selected but no ticket type?
        // Let's use the explicit selectedTickets map.
        Object.values(state.selectedTickets).forEach(ticket => {
            total += ticket.price
        })
        return total + (state.selectedSeats.length * state.bookingFee)
    },
    seatCount: (state): number => state.selectedSeats.length
  },

  actions: {
    setMovie(movie: Movie) {
      this.currentMovie = movie
    },
    setSession(session: Session) {
      this.currentSession = session
      this.selectedSeats = []
      this.selectedTickets = {}
    },
    toggleSeat(seat: Seat) {
      const index = this.selectedSeats.findIndex(s => s.id === seat.id)
      if (index === -1) {
        if (this.selectedSeats.length >= 8) { // Updated to 8 based on seats.vue UI text "/ 8"
            alert("Maximum 8 seats per booking.") // Updated alert too
            return
        }
        this.selectedSeats.push(seat)
      } else {
        this.selectedSeats.splice(index, 1)
        delete this.selectedTickets[seat.id]
      }
    },
    setTicketType(seatId: string, ticketType: Ticket) {
        this.selectedTickets[seatId] = ticketType
    },
    clearBooking() {
      this.selectedSeats = []
      this.selectedTickets = {}
      this.currentMovie = null
      this.currentSession = null
    }
  }
})
