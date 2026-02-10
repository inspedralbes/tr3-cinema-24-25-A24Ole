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
        $this->command->info('Seeding Movies...');
        // 1. Crear Películas
        $movies = [
            ['title' => 'Inception', 'poster_url' => 'inception.jpg', 'duration_min' => 148],
            ['title' => 'Interstellar', 'poster_url' => 'interstellar.jpg', 'duration_min' => 169],
            ['title' => 'The Dark Knight', 'poster_url' => 'dark_knight.jpg', 'duration_min' => 152],
        ];

        foreach ($movies as $movie) {
            DB::table('movies')->insert([
                'title' => $movie['title'],
                'poster_url' => $movie['poster_url'],
                'duration_min' => $movie['duration_min'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        $this->command->info('Movies seeded.');

        $this->command->info('Seeding Rooms...');
        // 2. Crear Salas
        $rooms = [
            ['name' => 'Sala A', 'rows_count' => 5, 'cols_count' => 10], // 50 asientos
            ['name' => 'Sala B', 'rows_count' => 8, 'cols_count' => 12], // 96 asientos
        ];

        foreach ($rooms as $roomData) {
            $roomId = DB::table('rooms')->insertGetId([
                'name' => $roomData['name'],
                'rows_count' => $roomData['rows_count'],
                'cols_count' => $roomData['cols_count'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info("Seeding Seats for Room $roomId...");
            // 3. Crear Asientos para la Sala (Lógica VIP/Disabled)
            for ($row = 1; $row <= $roomData['rows_count']; $row++) {
                $rowLabel = chr(64 + $row); // A, B, C...
                
                for ($num = 1; $num <= $roomData['cols_count']; $num++) {
                    $type = 'standard';
                    
                    if ($row === 1) $type = 'disabled'; // Primera fila
                    if ($row === 3) $type = 'vip';      // Tercera fila
                    
                    DB::table('seats')->insert([
                        'room_id' => $roomId,
                        'row_label' => $rowLabel,
                        'seat_number' => $num,
                        'type' => $type,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
        $this->command->info('Rooms and Seats seeded.');

        $this->command->info('Seeding Sessions...');
        // 4. Crear Sesiones (Ejemplo)
        $sessionDate = Carbon::tomorrow()->setTime(18, 0, 0);
        
        $firstMovieId = DB::table('movies')->first()->id;
        $firstRoomId = DB::table('rooms')->first()->id;

        DB::table('sessions')->insert([
            'movie_id' => $firstMovieId,
            'room_id' => $firstRoomId,
            'start_at' => $sessionDate,
            'price_base' => 9.50,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
