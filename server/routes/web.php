<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('admin.layout.master');
});


Route::get('/product', function () {
    return view('admin.product.all');
});

Route::get('/product/show', function () {
    return view('admin.product.show');
});

Route::get('/product/create', function () {
    return view('admin.product.createUpdate');
});


