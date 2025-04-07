<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentInfoTable extends Migration
{
    public function up()
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

    public function down()
    {
        Schema::dropIfExists('payment_info');
    }
}