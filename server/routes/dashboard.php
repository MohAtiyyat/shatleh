<?php

use App\Http\Controllers\Dashboard\AddressController;
use App\Http\Controllers\Dashboard\AuthController;
use App\Http\Controllers\Dashboard\CartController;
use App\Http\Controllers\Dashboard\CategoryController;
use App\Http\Controllers\Dashboard\CouponController;
use App\Http\Controllers\Dashboard\CustomerController;
use App\Http\Controllers\Dashboard\LogController;
use App\Http\Controllers\Dashboard\OrderController;
use App\Http\Controllers\Dashboard\PaymentController;
use App\Http\Controllers\Dashboard\PostController;
use App\Http\Controllers\Dashboard\ProductController;
use App\Http\Controllers\Dashboard\ProductShopController;
use App\Http\Controllers\Dashboard\ServiceController;
use App\Http\Controllers\Dashboard\ServiceRequestController;
use App\Http\Controllers\Dashboard\ShopController;
use App\Http\Controllers\Dashboard\SpecialtiesController;
use App\Http\Controllers\Dashboard\StaffController;
use Illuminate\Support\Facades\Route;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::name('dashboard.')->middleware('web')->prefix('dashboard')->group(function () {
    Route::get('/home', function () {return view('admin.index');})->name('home');
    // logging test route
    Route::get('/test-log', function () {
        \Log::channel('mysql')->info('Test log entry', [
            'user_id' => 29,
            'action' => 'logout',
        ]);
        return 'Log entry created';
    });
    Route::prefix('logs')->name('logs.')->group(function () {
        Route::get('/', [LogController::class, 'index'])->name('index');//the index page has two buttons customer and staff
        Route::get('/customer', [LogController::class, 'CustomerLog'])->name('customer');//the customer logs page
        Route::get('/staff', [LogController::class, 'StaffLog'])->name('staff');//the staff logs page
    });
    Route::get('/login', function () {return view('admin.login.login');})->name('login');
    Route::post('/login', [AuthController::class, 'Login'])->name('login');
    Route::get('/logout', [AuthController::class, 'Logout'])->name('logout');
    Route::post('/logout', [AuthController::class, 'Logout'])->name('logout');

    Route::middleware(['auth:web', 'check-banned','role:Admin|Expert|Employee'])->group(function () {
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
            Route::get('/', [ShopController::class, 'index'])->name('shop');
            Route::get('/create', [ShopController::class, 'create'])->name('shop.create');
            Route::post('/create', [ShopController::class, 'store'])->name('shop.store');
            Route::get('/{id}/edit', [ShopController::class, 'edit'])->name('shop.edit');
            Route::get('/{id}', [ShopController::class, 'show'])->name('shop.show');
            Route::put('/{id}', [ShopController::class, 'update'])->name('shop.update');
            Route::delete('/{id}', [ShopController::class, 'delete'])->name('shop.destroy');
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
            Route::delete('/{id}',[CategoryController::class, 'destroy'])->name('category.destroy');

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

        Route::group([], function () {
            Route::resource('customer', CustomerController::class);
            Route::patch('customer/{customer}/toggle-ban', [CustomerController::class, 'toggleBan'])->name('customer.toggleBan');
            Route::patch('customer/{customer}/reset-password', [CustomerController::class, 'resetPassword'])->name('customer.resetPassword');
        });

        Route::name('staff')->prefix('staff')->group(function () {
            Route::get('/', [StaffController::class, 'index'])->name('');
            Route::get('/create', [StaffController::class, 'create'])->name('.create');
            Route::post('/create', [StaffController::class, 'store'])->name('.store');
            Route::get('/{id}/edit', [StaffController::class, 'edit'])->name('.edit');
            Route::get('/{id}', [StaffController::class, 'show'])->name('.show');
            Route::put('/{id}', [StaffController::class, 'update'])->name('.update');
            Route::delete('/{id}', [StaffController::class, 'delete'])->name('.destroy');
            Route::post('/{id}/change-password', [StaffController::class, 'resetPassword'])->name('.resetPassword');
            Route::patch('/{id}/toggle-ban', [StaffController::class, 'ban'])->name('.toggleBan');
        });

        Route::prefix('service-request')->name('service-request.')->group(function () {

            Route::resource('/', ServiceRequestController::class)
                ->only(['index', 'update'])
                ->parameter('', 'service_request');

            Route::post('{service_request}/assign', [ServiceRequestController::class, 'assign'])
                ->name('assign')
                ->whereNumber('service_request');
        });

        Route::name('cart')->prefix('cart')->group(function () {
            Route::get('/', [CartController::class, 'index'])->name('.index');
            Route::get('/{id}', [CartController::class, 'show'])->name('.show');

        });

        Route::name('service')->prefix('service')->group(function () {
            Route::get('/', [ServiceController::class, 'index'])->name('');
            Route::get('/create', [ServiceController::class, 'create'])->name('.create');
            Route::post('/create', [ServiceController::class, 'store'])->name('.store');
            Route::get('/{id}/edit', [ServiceController::class, 'edit'])->name('.edit');
            Route::get('/{id}', [ServiceController::class, 'show'])->name('.show');
            Route::put('/{id}', [ServiceController::class, 'update'])->name('.update');
            Route::delete('/{id}', [ServiceController::class, 'delete'])->name('.destroy');
        });

        Route::name('order')->prefix('order')->group(function () {
            Route::get('/', [OrderController::class, 'index'])->name('');
            Route::get('/{order}', [OrderController::class, 'show'])->name('.show');
            Route::put('/{order}', [OrderController::class, 'updateStatus'])->name('.updateStatus');
        });
        Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
        Route::resource('specialties', SpecialtiesController::class)->except('show');

        Route::resource('coupon', CouponController::class)->except('show');

        Route::resource('post', PostController::class);
    });
});

Route::get('/storage/{path}/{file}', function ($path, $file) {
    $filePath = storage_path('app/public/' . $path . '/' . $file);
    if (file_exists($filePath)) {
        return response()->file($filePath);
    }
    abort(404);
})->where('path', '.*')->middleware('web');
