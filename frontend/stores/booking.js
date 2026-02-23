import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    currentMovie: null,
    currentSession: null,
    selectedSeats: [],
    selectedTickets: {},
    bookingFee: 1.25
  }),

  getters: {
    totalTicketPrice: (state) => {
      let total = 0
      state.selectedSeats.forEach(seat => {
        const ticket = state.selectedTickets[seat.id]
        if (ticket) {
          total += ticket.price
        } else {
            total += 0
        }
      })
      return total
    },
    totalBookingFee: (state) => {
        return state.selectedSeats.length * state.bookingFee
    },
    grandTotal: (state) => {
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
      this.selectedSeats = []
      this.selectedTickets = {}
    },
    toggleSeat(seat) {
      const index = this.selectedSeats.findIndex(s => s.id === seat.id)
      if (index === -1) {
        if (this.selectedSeats.length >= 8) {
            alert("Maximum 8 seats per booking.")
            return
        }
        this.selectedSeats.push(seat)
        
        let ticketId = 'adult';
        let ticketName = 'General Admission';
        let ticketPrice = seat.price || 12.50;
        
        if (seat.type === 'vip') {
            ticketId = 'vip';
            ticketName = 'VIP Experience';
        } else if (seat.type === 'disabled') {
            ticketId = 'accessible';
            ticketName = 'Accessible Seat';
        }

        this.selectedTickets[seat.id] = { id: ticketId, name: ticketName, price: ticketPrice };

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
