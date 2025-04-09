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
        Schema::table('users', function (Blueprint $table) {
            $table->text('bio')->nullable()->change();
            $table->boolean('is_banned')->default(0)->change();
            $table->unsignedBigInteger('address_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('bio')->nullable(false)->change();
            $table->boolean('is_banned')->default(null)->change(); // Assuming no default originally
            $table->unsignedBigInteger('address_id')->nullable(false)->change();
        });
    }
};