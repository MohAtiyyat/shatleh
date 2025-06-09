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
        Schema::dropIfExists('payments');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id');
            $table->foreignId('customer_id');
            $table->integer('amount');
            $table->foreignId('payment_info_id');
            $table->string('status');
            $table->string('refund_status');
            $table->softDeletes();
            $table->timestamps();
        });
    }
};
