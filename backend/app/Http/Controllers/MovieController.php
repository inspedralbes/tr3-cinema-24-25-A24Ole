<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Movie;

class MovieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Fetch the top 8 movies from our database
            $movies = Movie::limit(8)->get();
            
            // Map to frontend expected structure
            $formattedMovies = $movies->map(function ($movie) {
                return [
                    'id' => $movie->external_id ?? $movie->id, // Fallback for old records without external_id
                    'title' => $movie->title,
                    'genre' => $movie->genre,
                    // Use stored duration or generate a fallback 
                    'duration' => $movie->duration_min ? ($movie->duration_min . ' min') : (rand(1, 4) > 2 ? (rand(90, 180) . ' min') : (rand(1, 3) . 'h ' . rand(0, 59) . 'm')),
                    'poster' => $movie->poster_url, 
                    'description' => $movie->description,
                    'year' => $movie->year,
                    'stars' => $movie->stars
                ];
            });

            return response()->json($formattedMovies);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
