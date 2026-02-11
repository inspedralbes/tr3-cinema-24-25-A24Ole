import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    currentMovie: null,
    currentSession: null,
    selectedSeats: [], // Array of { row, number, type, id, price }
    selectedTickets: {}, // Map of seatId -> ticketType { name, price }
    bookingFee: 1.25 // Per ticket
  }),

  getters: {
    totalTicketPrice: (state) => {
      let total = 0
      state.selectedSeats.forEach(seat => {
        const ticket = state.selectedTickets[seat.id]
        if (ticket) {
          total += ticket.price
        } else {
            // Default price if not yet selected? Or 0?
            // Assuming base price from seat if not specified, or 0.
            // For now, let's assume 0 until ticket type selected.
            total += 0 
        }
      })
      return total
    },
    totalBookingFee: (state) => {
        return state.selectedSeats.length * state.bookingFee
    },
    grandTotal: (state) => {
        // Calculate based on selected tickets
        let total = 0
        Object.values(state.selectedTickets).forEach(ticket => {
            total += ticket.price
        })
        return total + (state.selectedSeats.length * state.bookingFee)
    },
    seatCount: (state) => state.selectedSeats.length
  },

  actions: {
    setMovie(movie) {
      this.currentMovie = movie
    },
    setSession(session) {
      this.currentSession = session
      // Clear selections when session changes
      this.selectedSeats = []
      this.selectedTickets = {}
    },
    toggleSeat(seat) {
      const index = this.selectedSeats.findIndex(s => s.id === seat.id)
      if (index === -1) {
        if (this.selectedSeats.length >= 5) {
            alert("Maximum 5 seats per booking.")
            return
        }
        this.selectedSeats.push(seat)
        // Initialize with default ticket if needed, or leave empty to force selection
      } else {
        this.selectedSeats.splice(index, 1)
        delete this.selectedTickets[seat.id]
      }
    },
    setTicketType(seatId, ticketType) {
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
