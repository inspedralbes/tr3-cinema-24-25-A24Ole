<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PeliculaController;
use App\Http\Controllers\Api\ReservaController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/peliculas', [PeliculaController::class, 'index']);
Route::get('/pelicula/{id}', [PeliculaController::class, 'show']);
Route::post('/reservas', [ReservaController::class, 'store']);
Route::get('/reservas/{id}', [ReservaController::class, 'show']);
Route::get('/peliculas/{id}/asientos-ocupados', [ReservaController::class, 'getOcupadosByPelicula']);
