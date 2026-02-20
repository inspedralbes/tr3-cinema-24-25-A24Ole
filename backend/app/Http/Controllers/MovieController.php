<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MovieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $response = Http::withOptions(['verify' => false])->get('https://devsapihub.com/api-movies');
            
            if ($response->successful()) {
                $movies = $response->json();
                
                // Select 5 random movies
                $randomMovies = collect($movies)->random(5)->values();
                
                // Map to frontend structure
                $formattedMovies = $randomMovies->map(function ($movie) {
                    return [
                        'id' => $movie['id'],
                        'title' => $movie['title'],
                        'genre' => $movie['genre'],
                        // Generate random duration between 90 and 180 minutes
                        'duration' => rand(1, 4) > 2 ? (rand(90, 180) . ' min') : (rand(1, 3) . 'h ' . rand(0, 59) . 'm'),
                        'poster' => $movie['image_url'], // Map image_url to poster
                        'description' => $movie['description'],
                        'year' => $movie['year'],
                        'stars' => $movie['stars']
                    ];
                });

                return response()->json($formattedMovies);
            }

            return response()->json(['error' => 'Unable to fetch movies'], 500);
            
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
