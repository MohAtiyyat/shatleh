<?php

use App\Http\Controllers\Dashboard\AddressController;
use App\Http\Controllers\Dashboard\AuthController;
use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\ProductShopController;
use App\Http\Controllers\Dashboard\ShopController;
use App\Http\Controllers\Dashboard\StaffController;
use Illuminate\Support\Facades\Route;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::name('dashboard.')->middleware('web')->prefix('dashboard')->group(function () {


    Route::get('/login', function () {return view('admin.login.login');});
    Route::post('/login', [AuthController::class, 'Login'])->name('login');
    Route::get('/logout', [AuthController::class, 'Logout'])->name('logout');
    Route::post('/logout', [AuthController::class, 'Logout'])->name('logout');

    Route::middleware(['auth:web', 'role:Admin|super-admin'])->group(function () {
        Route::prefix('product')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->name('product');
            Route::get('/create', [ProductController::class, 'create'])->name('product.create');
            Route::post('/create', [ProductController::class, 'store'])->name('product.create');
            Route::get('/{id}/edit', [ProductController::class, 'edit'])->name('product.edit');
            Route::get('/{id}', [ProductController::class, 'show'])->name('product.show');
            Route::put('/{product}', [ProductController::class, 'update'])->name('product.update');
            Route::delete('/{id}', [ProductController::class, 'delete'])->name('product.destroy');
        });

        Route::prefix('shop')->group(function () {
            Route::get('/', [ShopController::class, 'index'])->name('Shop');
            Route::get('/create', [ShopController::class, 'create'])->name('Shop.create');
            Route::post('/create', [ShopController::class, 'store'])->name('Shop.store');
            Route::get('/{id}/edit', [ShopController::class, 'edit'])->name('Shop.edit');
            Route::get('/{id}', [ShopController::class, 'show'])->name('Shop.show');
            Route::put('/{id}', [ShopController::class, 'update'])->name('Shop.update');
            Route::delete('/{id}', [ShopController::class, 'delete'])->name('Shop.destroy');
        });

        Route::prefix('address')->group(function () {
            Route::get('/', [AddressController::class, 'index'])->name('address');
            Route::get('/create', [AddressController::class, 'create'])->name('address.create');
            Route::post('/create', [AddressController::class, 'store'])->name('address.store');
            Route::get('/{id}/edit', [AddressController::class, 'edit'])->name('address.edit');
            Route::get('/{id}', [AddressController::class, 'show'])->name('address.show');
            Route::put('/{id}', [AddressController::class, 'update'])->name('address.update');
            Route::delete('/{id}', [AddressController::class, 'delete'])->name('address.destroy');
        });

        Route::prefix('category')->group(function () {
            Route::get('/', [CategoryController::class, 'index'])->name('category');
            Route::get('/create',[CategoryController::class, 'create'])->name('category.create');
            Route::post('/create',[CategoryController::class, 'store'])->name('category.store');
            Route::get('/{id}/edit',[CategoryController::class, 'edit'])->name('category.edit');
            Route::get('/{id}',[CategoryController::class, 'show'])->name('category.show');
            Route::put('/{id}',[CategoryController::class, 'update'])->name('category.update');
            Route::delete('/{id}',[CategoryController::class, 'delete'])->name('category.delete');

        });

        Route::prefix('product-shop')->group(function () {
            Route::get('/', [ProductShopController::class, 'index'])->name('productShop');
            Route::get('/create', [ProductShopController::class, 'create'])->name('productShop.create');
            Route::post('/create', [ProductShopController::class, 'store'])->name('productShop.store');
            Route::get('/{id}/edit', [ProductShopController::class, 'edit'])->name('productShop.edit');
            Route::get('/{id}', [ProductShopController::class, 'show'])->name('productShop.show');
            Route::put('/{id}', [ProductShopController::class, 'update'])->name('productShop.update');
            Route::delete('/{id}', [ProductShopController::class, 'delete'])->name('productShop.destroy');
        });

        Route::name('staff')->prefix('staff')->group(function () {
            Route::get('/', [StaffController::class, 'index'])->name('');
        });
    });
});
