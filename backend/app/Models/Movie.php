<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    protected $fillable = [
        'external_id', 
        'title', 
        'poster_url', 
        'duration_min',
        'description',
        'genre',
        'year',
        'stars'
    ];
}
