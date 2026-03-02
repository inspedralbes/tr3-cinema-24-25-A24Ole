<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asiento extends Model
{
    use HasFactory;

    protected $table = 'asientos';

    protected $fillable = [
        'pelicula_id',
        'reserva_id',
        'asiento_id',
        'tipo',
        'estado'
    ];

    public function pelicula()
    {
        return $this->belongsTo(Pelicula::class, 'pelicula_id', 'id_pelicula_api');
    }

    public function reserva()
    {
        return $this->belongsTo(Reserva::class, 'reserva_id');
    }
}
