<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code');
            $table->foreignId('address_id');
            $table->integer('total_price');
            $table->foreignId('user_id');
            $table->foreignId('employee_id');
            $table->foreignId('coupon_id');
            $table->foreignId('payment_id');
            $table->string('status');
            $table->integer('delivery_cost');
            $table->timestamp('delivered_at');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
}