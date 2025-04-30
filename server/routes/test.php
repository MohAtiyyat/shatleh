<?php

use Illuminate\Support\Facades\Route;

Route::prefix('test')->group(function () {
    Route::get('/', function () {
        return view('admin.layout.master');
    });
    
    Route::get('/product', function () {
        return view('admin.product.index');
    })->name('product');
    
    Route::get('/customer', function () {
        return view('admin.customer.index');
    })->name('customer');
    
    Route::get('/customer/create', function () {
        return view('admin.customer.create');
    })->name('customer.create');
    
    Route::get('/product/create', function () {
        return view('admin.product.createUpdate');
    })->name('product.create');
    
    
    Route::get('/order', function () {
        return view('admin.Order.index');
    })->name('order');
    
    Route::get('/product/{id}', function () {
        return view('admin.product.show');
    })->name('product.show');
    
    
    Route::get('/product/{id}/edit', function () {
        return view('admin.product.createUpdate');
    })->name('product.edit');    
});