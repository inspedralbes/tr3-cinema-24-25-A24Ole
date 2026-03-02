<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelicula extends Model
{
    use HasFactory;

    protected $table = 'peliculas';
    protected $primaryKey = 'id_pelicula_api';

    // Disabling incrementing because the API ID is used
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'id_pelicula_api',
        'titulo',
        'poster_url',
        'duracion',
        'genero',
        'descripcion',
        'año'
    ];

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'pelicula_id', 'id_pelicula_api');
    }

    public function asientos()
    {
        return $this->hasMany(Asiento::class, 'pelicula_id', 'id_pelicula_api');
    }
}
