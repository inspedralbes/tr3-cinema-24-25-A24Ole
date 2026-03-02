<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asientos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pelicula_id')->constrained('peliculas', 'id_pelicula_api')->onDelete('cascade');
            $table->foreignId('reserva_id')->constrained('reservas')->onDelete('cascade');
            $table->enum('tipo', ['vip', 'minusvalido', 'estandard'])->default('estandard');
            $table->enum('estado', ['pagado', 'no_pagado'])->default('no_pagado');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asientos');
    }
};
