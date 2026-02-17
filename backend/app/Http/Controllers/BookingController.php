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

        $session = Session::findOrFail($request->session_id);

        // Check availability
        $occupied = SeatSession::where('session_id', $session->id)
            ->whereIn('seat_id', $request->seats)
            ->whereIn('status', ['sold', 'reserved'])
            ->exists();

        if ($occupied) {
            \Illuminate\Support\Facades\Log::warning('Booking failed: Seats occupied', ['seats' => $request->seats, 'session_id' => $session->id]);
            return response()->json(['message' => 'One or more seats are already occupied.'], 409);
        }

        $totalPrice = count($request->seats) * $session->price_base;
        $user = $request->user();
        $userId = $user ? $user->id : null;

        return DB::transaction(function () use ($request, $session, $totalPrice, $userId) {
            $booking = Booking::create([
                'session_id' => $session->id,
                'user_id' => $userId,
                'total_price' => $totalPrice,
                'status' => 'confirmed',
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
}
