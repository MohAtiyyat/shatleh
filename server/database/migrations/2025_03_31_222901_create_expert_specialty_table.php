<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExpertSpecialtyTable extends Migration
{
    public function up()
    {
        Schema::create('expert_specialty', function (Blueprint $table) {
            $table->foreignId('expert_id');
            $table->foreignId('specialty_id');
            $table->softDeletes();
            $table->timestamps();
            $table->primary(['expert_id', 'specialty_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('expert_specialty');
    }
}