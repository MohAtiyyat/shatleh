<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServiceRequestsTable extends Migration
{
    public function up()
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id');
            $table->foreignId('address_id');
            $table->text('details');
            $table->string('image');
            $table->foreignId('customer_id');
            $table->foreignId('employee_id');
            $table->foreignId('expert_id');
            $table->string('status');
            $table->string('phone_number');
            $table->string('customer_name');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('service_requests');
    }
}