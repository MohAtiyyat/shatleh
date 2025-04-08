<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('admin.layout.master');
});

Route::get('/product', function () {
    return view('admin.product.all');
})->name('product');

Route::get('/product/create', function () {
    return view('admin.product.createUpdate');
})->name('product.create');

Route::get('/login', function () {
    return view('admin.login.login');
});
Route::get('/product/{id}', function () {
    return view('admin.product.show');
})->name('product.show');


Route::get('/product/{id}/edit', function () {
    return view('admin.product.createUpdate');
})->name('product.edit');
