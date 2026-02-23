<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeatSession extends Model
{
    protected $table = 'seat_session';

    protected $fillable = [
        'session_id',
        'seat_id',
        'user_id',
        'status', // 'sold', 'reserved', 'blocked'
    ];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
