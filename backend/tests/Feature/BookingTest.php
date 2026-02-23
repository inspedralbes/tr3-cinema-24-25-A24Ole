<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Seat;
use App\Models\SeatSession;
use App\Models\Session;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_booking()
    {
        $user = User::factory()->create();
        
        $movie = \App\Models\Movie::create(['title' => 'Test Movie', 'duration_min' => 120, 'poster_url' => 'poster.jpg']);
        $room = \App\Models\Room::create(['name' => 'Room 1', 'rows_count' => 5, 'cols_count' => 5]); 
        $session = Session::create([
            'movie_id' => $movie->id,
            'room_id' => $room->id,
            'start_at' => now()->addDay(),
            'price_base' => 10.00,
        ]);
        
        $seat1_id = 'A1';
        $seat2_id = 'A2';

        $response = $this->actingAs($user)->postJson('/api/bookings', [
            'session_id' => $session->id,
            'seats' => [$seat1_id, $seat2_id],
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['data' => ['id', 'status', 'total_price']]);
        
        $this->assertDatabaseHas('bookings', [
            'session_id' => $session->id,
            'user_id' => $user->id,
            'total_price' => 20.00,
        ]);
        
        $this->assertDatabaseHas('seat_session', [
            'session_id' => $session->id,
            'seat_id' => $seat1_id,
            'status' => 'sold',
        ]);
    }

    public function test_cannot_book_occupied_seats()
    {
        $user = User::factory()->create();
        $movie = \App\Models\Movie::create(['title' => 'Test Movie', 'duration_min' => 120, 'poster_url' => 'poster.jpg']);
        $room = \App\Models\Room::create(['name' => 'Room 1', 'rows_count' => 5, 'cols_count' => 5]);
        $session = Session::create([
            'movie_id' => $movie->id,
            'room_id' => $room->id,
            'start_at' => now()->addDay(),
            'price_base' => 10.00,
        ]);
        $seat1_id = 'A1';

        // Occupy the seat
        SeatSession::create([
            'session_id' => $session->id,
            'seat_id' => $seat1_id,
            'user_id' => $user->id,
            'status' => 'sold',
        ]);

        $response = $this->actingAs($user)->postJson('/api/bookings', [
            'session_id' => $session->id,
            'seats' => [$seat1_id],
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
        ]);

        $response->assertStatus(409);
    }
}
