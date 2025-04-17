<?php

use App\Http\Controllers\Dashboard\AddressController;
use App\Http\Controllers\Dashboard\AuthController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\ShopController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->prefix('dashboard')->group(function () {
    
    Route::get('/login', function () {return view('admin.login.login');});
    Route::post('/login', [AuthController::class, 'Login'])->name('dashboard.login');

    Route::middleware('auth:web')->group(function () {

        Route::post('/logout', [AuthController::class, 'Logout'])->name('dashboard.logout');
        
        Route::prefix('product')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->name('dashboard.product');
            Route::get('/create', [ProductController::class, 'create'])->name('dashboard.product.create');
            Route::post('/create', [ProductController::class, 'store'])->name('dashboard.product.create');
            Route::get('/{id}/edit', [ProductController::class, 'edit'])->name('dashboard.product.edit');
            Route::get('/{id}', [ProductController::class, 'show'])->name('dashboard.product.show');
            Route::put('/{id}', [ProductController::class, 'update'])->name('dashboard.product.update');
            Route::delete('/{id}', [ProductController::class, 'delete'])->name('dashboard.product.destroy');
        });

        Route::prefix('shop')->group(function () {
            Route::get('/', [ShopController::class, 'index'])->name('dashboard.Shop');
            Route::get('/create', [ShopController::class, 'create'])->name('shop.create');
            Route::post('/create', [ShopController::class, 'store'])->name('dashboard.Shop.store');
            Route::get('/{id}/edit', [ShopController::class, 'edit'])->name('dashboard.Shop.edit');
            Route::get('/{id}', [ShopController::class, 'show'])->name('dashboard.Shop.show');
            Route::put('/{id}', [ShopController::class, 'update'])->name('dashboard.Shop.update');
            Route::delete('/{id}', [ShopController::class, 'delete'])->name('dashboard.Shop.destroy');
        });

        Route::prefix('address')->group(function () {
            Route::get('/', [AddressController::class, 'index'])->name('dashboard.address');
            Route::get('/create', [AddressController::class, 'create'])->name('dashboard.address.create');
            Route::post('/create', [AddressController::class, 'store'])->name('dashboard.address.store');
            Route::get('/{id}/edit', [AddressController::class, 'edit'])->name('dashboard.address.edit');
            Route::get('/{id}', [AddressController::class, 'show'])->name('dashboard.address.show');
            Route::put('/{id}', [AddressController::class, 'update'])->name('dashboard.address.update');
            Route::delete('/{id}', [AddressController::class, 'delete'])->name('dashboard.address.destroy');
        });


    });
});
