<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCouponProductsTable extends Migration
{
    public function up()
    {
        Schema::create('coupon_products', function (Blueprint $table) {
            $table->foreignId('coupon_id');
            $table->foreignId('product_id');
            $table->softDeletes();
            $table->timestamps();
            $table->primary(['coupon_id', 'product_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('coupon_products');
    }
}