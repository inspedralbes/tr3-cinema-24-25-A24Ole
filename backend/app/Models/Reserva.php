<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    protected $table = 'reservas';

    protected $fillable = [
        'user_id',
        'pelicula_id',
        'nombre',
        'email',
        'total_pagado'
    ];

    protected $casts = [
        'total_pagado' => 'decimal:2',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'user_id', 'id_usuario');
    }

    public function pelicula()
    {
        return $this->belongsTo(Pelicula::class, 'pelicula_id', 'id_pelicula_api');
    }

    public function asientos()
    {
        return $this->hasMany(Asiento::class, 'reserva_id');
    }
}
