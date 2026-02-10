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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained(); // Esta funciona porque 'sessions' ya existe.
            
            // CAMBIO AQUÍ: Eliminamos ->constrained()
            $table->unsignedBigInteger('user_id')->nullable(); 
            
            $table->decimal('total_price', 8, 2);
            $table->string('status')->default('confirmed');
            $table->timestamps();
        });

        Schema::create('booking_seat', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('seat_id')->nullable(); 
            $table->string('ticket_type');
            $table->decimal('price_paid', 8, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_seat');
        Schema::dropIfExists('bookings');
    }
};
