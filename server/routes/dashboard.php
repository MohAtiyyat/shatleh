<?php

use App\Http\Controllers\Dashboard\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    Route::get('/login', function () {
        return view('admin.login.login');
    });
    Route::post('/login', [AuthController::class, 'Login'])->name('dashboard.login');
});