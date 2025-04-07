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
        Schema::table('payment_info', function (Blueprint $table) {
            $table->renameColumn('user_id', 'customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_info', function (Blueprint $table) {
            $table->renameColumn('customer_id', 'user_id');
        });
    }
};
