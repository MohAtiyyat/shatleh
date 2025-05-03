<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\StripeController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('api.register');
    Route::post('/login', [AuthController::class, 'login'])->name('api.login');
    Route::get('/top_sellers', [ProductController::class, 'top_sellers'])->name('api.top_sellers');
    Route::get('/all_products', [ProductController::class, 'allProducts'])->name('api.all_products');
    Route::get('/services', [ServiceController::class, 'index'])->name('api.services');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
        Route::post('/checkout', [StripeController::class, 'checkout'])->name('api.checkout');
        Route::post('/service-requests', [ServiceController::class, 'storeServiceRequest'])->name('api.service-requests.store');

        // Profile routes
        Route::get('/profile', [ProfileController::class, 'getProfile'])->name('api.profile.show');
        Route::post('/profile', [ProfileController::class, 'updateProfile'])->name('api.profile.update');

        // Address routes
        Route::get('/addresses', [ProfileController::class, 'getAddresses'])->name('api.addresses.index');
        Route::post('/addresses', [ProfileController::class, 'storeAddress'])->name('api.addresses.store');
        Route::put('/addresses/{id}', [ProfileController::class, 'updateAddress'])->name('api.addresses.update');
        Route::post('/addresses/{id}/set-default', [ProfileController::class, 'setDefaultAddress'])->name('api.addresses.set-default');
        Route::delete('/addresses/{id}', [ProfileController::class, 'deleteAddress'])->name('api.addresses.destroy');
    });
});