<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CinemaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Skip seeding dummy movies (using API sync instead).');

        $this->command->info('Seeding Rooms...');
        $rooms = [
            ['id' => 1, 'name' => 'Sala A', 'rows_count' => 5, 'cols_count' => 10], // 50 asientos
            ['id' => 2, 'name' => 'Sala B', 'rows_count' => 8, 'cols_count' => 12], // 96 asientos
        ];

        foreach ($rooms as $roomData) {
            DB::table('rooms')->insert([
                'id' => $roomData['id'],
                'name' => $roomData['name'],
                'rows_count' => $roomData['rows_count'],
                'cols_count' => $roomData['cols_count'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $this->command->info('Rooms seeded.');

        $this->command->info('Seeding Sessions...');
        $sessionDate = Carbon::tomorrow()->setTime(18, 0, 0);

        // Fetch a real movie if available, otherwise session creation skips or uses dummy 1
        $firstMovie = DB::table('movies')->first();
        if ($firstMovie) {
            DB::table('sessions')->insert([
                'id' => 1,
                'movie_id' => $firstMovie->id,
                'room_id' => 1,
                'start_at' => $sessionDate,
                'price_base' => 10.00,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->command->info('Sessions seeded.');
        } else {
            $this->command->info('No movies found. Please run app:sync-movies before seeding sessions.');
        }
    }
}
