<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pelicula;
use Illuminate\Http\Request;

class PeliculaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $peliculas = Pelicula::limit(8)->get();
            
            $formateadas = $peliculas->map(function ($pelicula) {
                return [
                    'id' => $pelicula->id_pelicula_api,
                    'titulo' => $pelicula->titulo,
                    'genero' => $pelicula->genero,
                    'duracion' => $pelicula->duracion,
                    'poster_url' => $pelicula->poster_url, 
                    'descripcion' => $pelicula->descripcion,
                    'año' => $pelicula->año
                ];
            });

            return response()->json($formateadas);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Using find as the id is from API and we disabled incrementing integer logic in the model
        $pelicula = Pelicula::find($id);

        if (!$pelicula) {
            return response()->json([
                'success' => false,
                'message' => 'Película no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $pelicula
        ], 200);
    }
}
