<?php

use App\Http\Controllers\Dashboard\AuthController;
use App\Http\Controllers\Dashboard\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->prefix('dashboard')->group(function () {
    Route::get('/login', function () {
        return view('admin.login.login');
    });
    Route::post('/login', [AuthController::class, 'Login'])->name('dashboard.login');

    Route::middleware('auth:web')->group(function () {
        Route::post('/logout', [AuthController::class, 'Logout'])->name('dashboard.logout');
        Route::get('/product', [ProductController::class, 'index'])->name('dashboard.product');
        Route::post('/product', [ProductController::class, 'store'])->name('dashboard.product');
    });
    
});
