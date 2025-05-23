<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('api.register');
    Route::post('/login', [AuthController::class, 'login'])->name('api.login');
    Route::get('/top_sellers', [ProductController::class, 'top_sellers'])->name('api.top_sellers');
    Route::get('/all_products', [ProductController::class, 'allProducts'])->name('api.all_products');
    Route::get('/services', [ServiceController::class, 'index'])->name('api.services');
    Route::get('/categories', [ProductController::class, 'categories'])->name('api.categories');
    Route::get('/products/{productId}/reviews', [ReviewController::class, 'getTopReviews'])->name('api.reviews.index');
    Route::get('/blog', [PostController::class, 'index'])->name('api.blog.index');
    Route::get('/blog/{id}', [PostController::class, 'show'])->name('api.blog.show');
    Route::get('/coupons', [CouponController::class, 'index'])->name('api.coupons.index');
    Route::get('/search', [ProductController::class, 'search'])->name('api.search'); // New search route

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
        Route::post('/checkout', [CheckoutController::class, 'checkout'])->name('api.checkout');
        Route::post('/service-requests', [ServiceController::class, 'storeServiceRequest'])->name('api.service-requests.store');
        Route::post('/products/reviews', [ReviewController::class, 'submitReview'])->name('api.reviews.store');
        Route::post('/blog/{postId}/bookmark', [PostController::class, 'bookmarksToggle'])->name('api.blog.bookmark');
        Route::get('/bookmarks', [PostController::class, 'getBookmarks'])->name('api.bookmarks');

        // Profile routes
        Route::get('/profile', [ProfileController::class, 'getProfile'])->name('api.profile.show');
        Route::post('/profile', [ProfileController::class, 'updateProfile'])->name('api.profile.update');

        // Address routes
        Route::get('/addresses', [ProfileController::class, 'getAddresses'])->name('api.addresses.index');
        Route::post('/addresses', [ProfileController::class, 'storeAddress'])->name('api.addresses.store');
        Route::put('/addresses/{id}', [ProfileController::class, 'updateAddress'])->name('api.addresses.update');
        Route::post('/addresses/{id}/set-default', [ProfileController::class, 'setDefaultAddress'])->name('api.addresses.set-default');
        Route::delete('/addresses/{id}', [ProfileController::class, 'deleteAddress'])->name('api.addresses.destroy');

        // Cart routes
        Route::post('/cart', [CartController::class, 'index'])->name('api.cart.index');
        Route::post('/cart/update', [CartController::class, 'update'])->name('api.cart.update');
        Route::post('/cart/clear', [CartController::class, 'clear'])->name('api.cart.clear');

        // Coupon routes
        Route::post('/coupons/apply', [CouponController::class, 'apply'])->name('api.coupons.apply');

        // Orders routes
        Route::get('/orders', [ProfileController::class, 'getOrders'])->name('api.orders.index');
        Route::get('/service-requests', [ProfileController::class, 'getServiceRequests'])->name('api.service_requests.index');
        Route::post('/orders/{id}/cancel', [ProfileController::class, 'cancelOrder'])->name('api.orders.cancel');
    });
});
