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
            $table->foreignId('session_id')->constrained()->onDelete('cascade'); 
            $table->unsignedBigInteger('user_id')->nullable(); 
            
            $table->decimal('total_price', 8, 2);
            $table->string('status')->default('confirmed');
            $table->timestamps();
        });
        // bookings_seat table removed as per new logic
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
