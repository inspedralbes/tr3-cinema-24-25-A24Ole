export interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  poster: string;
}

export interface Seat {
  id: string;
  label: string;
  row: string;
  number: number;
  type: 'standard' | 'vip' | 'disabled';
  status: 'available' | 'occupied' | 'blocked';
  price: number;
}

export interface Ticket {
  name: string;
  price: number;
}

export interface Session {
  id: number;
  time: string;
  hall: string;
  price: number;
}

export interface BookingState {
  currentMovie: Movie | null;
  currentSession: Session | null;
  selectedSeats: Seat[];
  selectedTickets: Record<string, Ticket>;
  bookingFee: number;
}
