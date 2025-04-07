<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoryProductsTable extends Migration
{
    public function up()
    {
        Schema::create('category_products', function (Blueprint $table) {
            $table->foreignId('category_id');
            $table->foreignId('product_id');
            $table->softDeletes();
            $table->timestamps();
            $table->primary(['category_id', 'product_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('category_products');
    }
}