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
        Schema::dropIfExists('payment_info');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('payment_info', function (Blueprint $table) {
            $table->id();
            $table->string('card_type');
            $table->string('card_number');
            $table->string('cvv');
            $table->string('card_holder_name');
            $table->foreignId('user_id');
            $table->softDeletes();
            $table->timestamps();
        });
    }
};
