<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $fillable = ['movie_id', 'room_id', 'start_at', 'price_base'];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function seatSessions()
    {
        return $this->hasMany(SeatSession::class);
    }

    // Existing relationships should be here (movie, room), adding if missing context implies structure
    public function movie()
    {
        return $this->belongsTo(Movie::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
