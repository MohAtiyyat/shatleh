<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderDetailsTable extends Migration
{
    public function up()
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->foreignId('order_id');
            $table->foreignId('product_id');
            $table->integer('price');
            $table->integer('quantity');
            $table->softDeletes();
            $table->timestamps();
            $table->primary(['order_id', 'product_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_details');
    }
}