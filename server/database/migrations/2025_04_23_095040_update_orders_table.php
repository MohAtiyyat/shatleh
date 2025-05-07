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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('customer_id');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('phone_number')->nullable()->after('last_name');
            $table->boolean('is_gift')->default(0)->after('phone_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['first_name', 'last_name', 'phone_number', 'is_gift']);
        });
    }
};
