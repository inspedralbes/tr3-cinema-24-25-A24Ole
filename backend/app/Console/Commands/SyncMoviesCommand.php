<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Movie;

class SyncMoviesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-movies';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch top 8 movies from devsapihub API and upsert them to the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting movie synchronization...');

        try {
            $response = Http::withOptions(['verify' => false])->get('https://devsapihub.com/api-movies');
            
            if (!$response->successful()) {
                $this->error('Failed to fetch movies from API: HTTP ' . $response->status());
                return Command::FAILURE;
            }

            $moviesData = $response->json();
            
            // Limit to top 8 movies
            $topMovies = collect($moviesData)->take(8);
            
            $upsertData = $topMovies->map(function ($movie) {
                return [
                    'external_id' => $movie['id'], // API ID
                    'title'       => $movie['title'],
                    'description' => $movie['description'],
                    'year'        => $movie['year'],
                    'genre'       => $movie['genre'],
                    'stars'       => $movie['stars'],
                    'poster_url'  => $movie['image_url'], // Map API field to DB field
                    // Generate a random duration in minutes since API doesn't provide it
                    'duration_min'=> rand(90, 180),
                    // required timestamp fields for upsert if not handled automatically
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];
            })->toArray();

            // Perform bulk upsert
            // Argument 1: The data to insert/update
            // Argument 2: The unique key(s) to match by (external_id in this case)
            // Argument 3: The columns to update if the record already exists
            Movie::upsert(
                $upsertData,
                ['external_id'],
                ['title', 'description', 'year', 'genre', 'stars', 'poster_url', 'duration_min', 'updated_at']
            );

            $this->info('Successfully synchronized ' . count($upsertData) . ' movies.');
            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error('An error occurred during synchronization: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
