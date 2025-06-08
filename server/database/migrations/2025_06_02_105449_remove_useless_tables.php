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
       Schema::table('model_has_permissions', function (Blueprint $table) {
            $table->dropForeign(['permission_id']); 
        });
        Schema::table('role_has_permissions', function (Blueprint $table) {
            $table->dropForeign(['permission_id']);
        });
        Schema::dropIfExists('permissions');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
