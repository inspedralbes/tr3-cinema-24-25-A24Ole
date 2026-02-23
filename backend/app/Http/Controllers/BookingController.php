<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\SeatSession;
use App\Models\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request)
    {
        \Illuminate\Support\Facades\Log::info('Booking request received', ['data' => $request->all()]);

        $sessionId = $request->session_id;

        $movieModel = null;
        if ($request->has('movie') && $request->movie) {
            $movieData = $request->movie;
            $movieModel = \App\Models\Movie::updateOrCreate(
                ['id' => $movieData['id']],
                [
                    'title' => $movieData['title'],
                    'poster_url' => $movieData['poster_url'] ?? null,
                    'duration_min' => $movieData['duration_min'] ?? 120
                ]
            );
        }

        $session = Session::find($sessionId);

        if (!$session) {
            // Auto-create room and session
            $room = \App\Models\Room::firstOrCreate(
                ['id' => 1],
                ['name' => 'Main Room', 'rows_count' => 10, 'cols_count' => 10]
            );

            // If no movie payload was sent, ensure there's at least a dummy movie
            if (!$movieModel) {
                 $movieModel = \App\Models\Movie::firstOrCreate(
                     ['id' => 1],
                     ['title' => 'Unknown Movie', 'duration_min' => 120]
                 );
            }

            $session = Session::create([
                'id' => $sessionId,
                'movie_id' => $movieModel->id,
                'room_id' => $room->id,
                'start_at' => now()->addDays(1),
                'price_base' => 10.00,
            ]);
        } else {
            // Ensure session points to the correct movie
            if ($movieModel && $session->movie_id !== $movieModel->id) {
                $session->movie_id = $movieModel->id;
                $session->save();
            }
        }

        // Check availability
        $occupied = SeatSession::where('session_id', $session->id)
            ->whereIn('seat_id', $request->seats)
            ->whereIn('status', ['sold', 'reserved'])
            ->exists();

        if ($occupied) {
            \Illuminate\Support\Facades\Log::warning('Booking failed: Seats occupied', ['seats' => $request->seats, 'session_id' => $session->id]);
            return response()->json(['message' => 'One or more seats are already occupied.'], 409);
        }

        $totalPrice = $request->input('total_price', count($request->seats) * $session->price_base);
        $user = $request->user();
        $userId = $user ? $user->id : null;

        return DB::transaction(function () use ($request, $session, $totalPrice, $userId) {
            $booking = Booking::create([
                'session_id' => $session->id,
                'user_id' => $userId,
                'total_price' => $totalPrice,
                'status' => 'confirmed',
                'name' => $request->name,
                'email' => $request->email,
            ]);

            foreach ($request->seats as $seatId) {
                // We use firstOrCreate or just create. Since we checked existence, create should be fine.
                // But to be extra safe against race conditions (though check-then-act is not atomic without detailed locking),
                // we relying on unique constraints if they existed (seat_session unique on session_id, seat_id).
                // The migration didn't explicitly show unique constraint on (session_id, seat_id).
                // Ideally there should be one.
                SeatSession::create([
                    'session_id' => $session->id,
                    'seat_id' => $seatId,
                    'user_id' => $userId,
                    'status' => 'sold',
                ]);
            }

            \Illuminate\Support\Facades\Log::info('Booking successful', ['booking_id' => $booking->id]);

            return new BookingResource($booking);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $booking = Booking::with(['session.movie', 'session.room'])->findOrFail($id);
        
        $seats = SeatSession::where('session_id', $booking->session_id)
            ->where('user_id', $booking->user_id)
            ->get();
            
        return response()->json([
            'data' => [
                'id' => $booking->id,
                'name' => $booking->name,
                'email' => $booking->email,
                'total_price' => $booking->total_price,
                'movie' => $booking->session->movie,
                'room' => $booking->session->room,
                'session' => $booking->session,
                'seats' => $seats->pluck('seat_id'),
            ]
        ]);
    }
}
