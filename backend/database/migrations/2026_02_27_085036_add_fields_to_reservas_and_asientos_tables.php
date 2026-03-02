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
        Schema::table('reservas', function (Blueprint $table) {
            $table->string('nombre')->nullable();
            $table->string('email')->nullable();
        });

        Schema::table('asientos', function (Blueprint $table) {
            $table->string('asiento_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->dropColumn(['nombre', 'email']);
        });

        Schema::table('asientos', function (Blueprint $table) {
            $table->dropColumn('asiento_id');
        });
    }
};
