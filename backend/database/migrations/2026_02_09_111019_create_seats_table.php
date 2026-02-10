<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seats', function (Blueprint $table) {
    $table->id();
            $table->foreignId('room_id')->constrained();
            $table->string('row_label'); // Ej: 'A'
            $table->integer('seat_number'); // Ej: 5
            $table->enum('type', ['standard', 'disabled', 'vip'])->default('standard');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};
