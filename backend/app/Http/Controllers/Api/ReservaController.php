<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asiento;
use App\Models\Reserva;
use App\Models\Pelicula;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservaConfirmada;

class ReservaController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Solicitud de reserva recibida', ['data' => $request->all()]);

        $peliculaId = $request->pelicula_id;

        $peliculaModel = null;
        if ($request->has('movie') && $request->movie) {
            $peliculaData = $request->movie;
            $peliculaModel = Pelicula::updateOrCreate(
                ['id_pelicula_api' => $peliculaData['id']],
                [
                    'titulo' => $peliculaData['title'] ?? 'Unknown',
                    'poster_url' => $peliculaData['poster_url'] ?? $peliculaData['poster'] ?? 'N/A',
                    'duracion' => $peliculaData['duration_min'] ?? $peliculaData['duration'] ?? '120 min',
                    'genero' => $peliculaData['genre'] ?? 'Unknown',
                    'descripcion' => $peliculaData['description'] ?? '',
                    'año' => $peliculaData['year'] ?? 2026,
                ]
            );
        } else {
             $peliculaModel = Pelicula::firstOrCreate(
                 ['id_pelicula_api' => $peliculaId],
                 [
                    'titulo' => 'Unknown Movie', 
                    'poster_url' => 'N/A',
                    'duracion' => '120 min',
                    'genero' => 'Unknown',
                    'descripcion' => '',
                    'año' => 2026,
                 ]
             );
        }

        // Available check
        $ocupados = Asiento::where('pelicula_id', $peliculaId)
            ->whereIn('asiento_id', $request->seats)
            ->where('estado', 'pagado')
            ->exists();

        if ($ocupados) {
            Log::warning('Reserva fallida: Asientos ocupados', ['seats' => $request->seats, 'pelicula_id' => $peliculaId]);
            return response()->json(['message' => 'Uno o más asientos ya están ocupados.'], 409);
        }

        $totalPrecio = $request->input('total_price', count($request->seats) * 10.00);
        $user = $request->user('sanctum');
        $userId = $user ? $user->id_usuario : null;

        $reserva = DB::transaction(function () use ($request, $peliculaId, $totalPrecio, $userId, $peliculaModel) {
            $reserva = Reserva::create([
                'pelicula_id' => $peliculaId,
                'user_id' => $userId,
                'total_pagado' => $totalPrecio,
                'nombre' => $request->name,
                'email' => $request->email,
            ]);

            foreach ($request->seats as $seatId) {
                $tipoTicket = 'estandard';
                if ($seatId >= 1 && $seatId <= 10) {
                    $tipoTicket = 'minusvalido';
                } elseif ($seatId >= 21 && $seatId <= 30) {
                    $tipoTicket = 'vip';
                }

                Asiento::create([
                    'pelicula_id' => $peliculaId,
                    'reserva_id' => $reserva->id,
                    'asiento_id' => $seatId,
                    'tipo' => $tipoTicket,
                    'estado' => 'pagado',
                ]);
            }

            return $reserva;
        }); // Fin de la transacción

        // Enviar correo fuera de la transacción para evitar bloqueos y timeouts
        try {
            Mail::to($reserva->email)->queue(new ReservaConfirmada($reserva));
            Log::info('Correo de confirmación en cola (fuera de transacción)', ['email' => $reserva->email]);
        } catch (\Exception $e) {
            Log::error('Fallo al encolar correo de confirmación', ['error' => $e->getMessage()]);
        }

        return response()->json([
            'id' => $reserva->id,
            'nombre' => $reserva->nombre,
            'email' => $reserva->email,
            'total_pagado' => $reserva->total_pagado,
            'pelicula' => $peliculaModel
        ], 201);
    }

    public function show($id)
    {
        $reserva = Reserva::with(['pelicula'])->findOrFail($id);
        
        $asientos = Asiento::where('reserva_id', $reserva->id)->get();
            
        return response()->json([
            'data' => [
                'id' => $reserva->id,
                'nombre' => $reserva->nombre,
                'email' => $reserva->email,
                'total_pagado' => $reserva->total_pagado,
                'pelicula' => $reserva->pelicula,
                'asientos' => $asientos->pluck('asiento_id'),
            ]
        ]);
    }

    public function getOcupadosByPelicula($id)
    {
        $asientos = Asiento::where('pelicula_id', $id)
            ->where('estado', 'pagado')
            ->pluck('asiento_id');
            
        return response()->json([
            'data' => $asientos
        ]);
    }
}
