<?php

use App\Http\Controllers\Dashboard\AuthController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\ShopController;
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
        Route::get('/product/create', [ProductController::class, 'create'])->name('dashboard.product.create');
        Route::post('/product/create', [ProductController::class, 'store'])->name('dashboard.product.create');

    Route::get('/shop',[ShopController::class,'index'])->name('dashboard.Shop');

    Route::get('/shop/create', [ShopController::class, 'create'])->name('shop.create');

    Route::post('/shop', [ShopController::class, 'store'])->name('dashboard.Shop.store');

    Route::get('/shop/{id}/edit', [ShopController::class, 'edit'])->name('dashboard.Shop.edit');

    Route::get('/shop/{id}', [ShopController::class, 'show'])->name('dashboard.Shop.show');

    Route::put('/shop/{id}', [ShopController::class, 'update'])->name('dashboard.Shop.update');

    Route::delete('/shop/{id}', [ShopController::class, 'destroy'])->name('dashboard.Shop.destroy');
    });
});
