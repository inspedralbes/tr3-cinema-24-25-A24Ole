<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Pelicula;

class SincronizarPeliculasCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sincronizar-peliculas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Obtiene 8 películas desde la API externa y las inserta/actualiza en la base de datos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Obteniendo películas desde la API: https://devsapihub.com/api-movies');

        try {
            $response = Http::get('https://devsapihub.com/api-movies');

            if ($response->failed()) {
                $this->error('No se pudo conectar con la API.');
                return Command::FAILURE;
            }

            $peliculasData = $response->collect()->take(8);

            if ($peliculasData->isEmpty()) {
                $this->warn('La API no devolvió ninguna película.');
                return Command::SUCCESS;
            }

            $count = 0;
            foreach ($peliculasData as $pelicula) {
                Pelicula::updateOrCreate(
                    ['id_pelicula_api' => $pelicula['id']],
                    [
                        'titulo' => $pelicula['title'],
                        'poster_url' => $pelicula['image_url'],
                        // Defaults to a string logic, since API doesn't have it explicitly
                        'duracion' => '120 min', 
                        'genero' => $pelicula['genre'] ?? 'Desconocido',
                        'descripcion' => $pelicula['description'] ?? '',
                        'año' => $pelicula['year']
                    ]
                );
                $count++;
            }

            $this->info("¡Peliculas guardadas con éxito! Total procesadas: {$count}");
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Ocurrió un error al sincronizar las películas: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
