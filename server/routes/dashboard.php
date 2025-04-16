<?php

use App\Http\Controllers\Dashboard\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->prefix('dashboard')->group(function () {
    Route::get('/login', function () {
        return view('admin.login.login');
    });
    Route::post('/login', [AuthController::class, 'Login'])->name('dashboard.login');

    Route::get('/product', function () {
        return view('admin.Product.all');
    });

    Route::get('/shop', function () {
        return view('admin.Shop.all');
    })->name('dashboard.Shop');

    Route::get('/shop/create', function () {
        return view('admin.Shop.createUpdate');
    })->name('shop.create');


    Route::post('/address', function () {
        return "done";
    })->name('address.store');

    Route::get('/product/{id}', function () {
        return view('admin.Product.show');
    });

    Route::get('/shop/{id}', function () {
        return view('admin.Shop.show');
    })->name('dashboard.Shop.show');

    Route::get('/product/{id}/edit', function () {
        return view('admin.product.createUpdate');
    })->name('product.edit');
});
