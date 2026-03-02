<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peliculas', function (Blueprint $table) {
            $table->id('id_pelicula_api'); // PK and Bigint unique implicitly (by using id())
            $table->string('titulo');
            $table->string('poster_url');
            $table->string('duracion');
            $table->string('genero');
            $table->text('descripcion');
            $table->integer('año');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peliculas');
    }
};
