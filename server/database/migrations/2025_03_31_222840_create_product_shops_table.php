<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductShopsTable extends Migration
{
    public function up()
    {
        Schema::create('product_shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id');
            $table->foreignId('shop_id');
            $table->integer('cost');
            $table->foreignId('employee_id');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_shops');
    }
}