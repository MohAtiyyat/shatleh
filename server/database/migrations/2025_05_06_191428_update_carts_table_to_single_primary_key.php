<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if the carts table exists to avoid errors
        if (!Schema::hasTable('carts')) {
            Schema::create('carts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
                $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
                $table->integer('quantity')->default(1);
                $table->timestamps();
                $table->unique(['customer_id', 'product_id'], 'carts_customer_product_unique');
            });
            return;
        }

        // Create a temporary table for the new schema
        Schema::create('carts_temp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->timestamps();
            $table->unique(['customer_id', 'product_id'], 'carts_temp_customer_product_unique');
        });

        // Copy existing data from carts to carts_temp
        DB::statement('
            INSERT INTO carts_temp (customer_id, product_id, quantity, created_at, updated_at)
            SELECT customer_id, product_id, quantity, created_at, updated_at
            FROM carts
        ');

        // Drop the old carts table
        Schema::dropIfExists('carts');

        // Rename carts_temp to carts
        Schema::rename('carts_temp', 'carts');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Create a temporary table with the original composite key schema
        Schema::create('carts_temp', function (Blueprint $table) {
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('product_id');
            $table->integer('quantity')->default(1);
            $table->timestamps();
            $table->primary(['product_id', 'customer_id'], 'carts_customer_product_primary');
            $table->foreign('customer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });

        // Copy data from carts to carts_temp
        if (Schema::hasTable('carts')) {
            DB::statement('
                INSERT INTO carts_temp (customer_id, product_id, quantity, created_at, updated_at)
                SELECT customer_id, product_id, quantity, created_at, updated_at
                FROM carts
            ');
        }

        // Drop the current carts table
        Schema::dropIfExists('carts');

        // Rename carts_temp to carts
        Schema::rename('carts_temp', 'carts');
    }
};