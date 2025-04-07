<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopsTable extends Migration
{
    public function up()
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('address_id');
            $table->string('name');
            $table->text('details');
            $table->string('owner_phone_number');
            $table->string('owner_name');
            $table->boolean('is_partner');
            $table->string('image');
            $table->foreignId('employee_id');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('shops');
    }
}