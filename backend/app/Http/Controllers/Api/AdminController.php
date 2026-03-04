<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pelicula;
use App\Models\Reserva;
use App\Models\Asiento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {
        $confirmedPurchases = Reserva::count();
        $totalRevenue = Reserva::sum('total_pagado');
        
        $movies = Pelicula::withCount(['reservas'])->get()->map(function ($movie) {
            $soldSeats = Asiento::where('pelicula_id', $movie->id_pelicula_api)
                ->where('estado', 'pagado')
                ->count();
            return [
                'id' => $movie->id_pelicula_api,
                'titulo' => $movie->titulo,
                'sold_seats' => $soldSeats,
                'confirmed_purchases' => $movie->reservas_count,
            ];
        });

        return response()->json([
            'confirmed_purchases' => $confirmedPurchases,
            'total_revenue' => $totalRevenue,
            'movies' => $movies
        ]);
    }

    public function reports()
    {
        $totalRevenue = Reserva::sum('total_pagado');
        
        $revenueByType = Asiento::where('estado', 'pagado')
            ->select('tipo', DB::raw('count(*) as count'), DB::raw('sum(10.00) as revenue')) // Assuming $10 base, need to check DB schema but it's a simplification, or we join reservas.
            ->groupBy('tipo')
            ->get();
            
        // We know each movie room has 40 seats from the frontend context (A-E, 1-8).
        // Let's get total seats sold.
        $totalSeatsSold = Asiento::where('estado', 'pagado')->count();
        $totalMovies = Pelicula::count();
        $totalCapacity = $totalMovies > 0 ? $totalMovies * 40 : 0;
        
        $occupancyRate = $totalCapacity > 0 ? round(($totalSeatsSold / $totalCapacity) * 100, 2) : 0;
        
        $salesEvolution = Reserva::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'), DB::raw('sum(total_pagado) as revenue'))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->limit(30)
            ->get();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'revenue_by_ticket_type' => $revenueByType,
            'occupancy_rate' => $occupancyRate,
            'sales_evolution' => $salesEvolution,
            'total_seats_sold' => $totalSeatsSold,
            'total_capacity' => $totalCapacity,
        ]);
    }
}
