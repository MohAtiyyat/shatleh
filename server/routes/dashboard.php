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
    Route::get('/product', function () {
        return view('admin.Product.all');
    });

    Route::get('/shop',[ShopController::class,'index'])->name('dashboard.Shop');

    Route::get('/shop/create', [ShopController::class, 'create'])->name('shop.create');

    Route::post('/shop', [ShopController::class, 'store'])->name('dashboard.Shop.store');


    Route::post('/address', function () {
        return "done";
    })->name('address.store');

    Route::get('/product/{id}', function () {
        return view('admin.Product.show');
    });

    Route::get('/shop/{id}', [ShopController::class, 'show'])->name('dashboard.Shop.show');


    Route::get('/product/{id}/edit', function () {
        return view('admin.product.createUpdate');
    })->name('product.edit');
});
});
