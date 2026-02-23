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
        Schema::table('movies', function (Blueprint $table) {
            $table->unsignedBigInteger('external_id')->unique()->after('id')->nullable();
            $table->text('description')->nullable()->after('duration_min');
            $table->string('genre')->nullable()->after('description');
            $table->integer('year')->nullable()->after('genre');
            $table->float('stars')->nullable()->after('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movies', function (Blueprint $table) {
            $table->dropColumn(['external_id', 'description', 'genre', 'year', 'stars']);
        });
    }
};
