<?php

use Illuminate\Support\Facades\Route;

Route::prefix('test')->group(function () {
    Route::get('/', function () {
        dd('ok');
        return view('');
    });
});