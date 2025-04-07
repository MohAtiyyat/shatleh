<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'name_en',
        'name_ar',
        'price',
        'image',
        'description_en',
        'description_ar',
        'status',
        'availability',
    ];

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_details', 'product_id', 'order_id')
        ->withPivot('price', 'quantity')
        ->as('order_details')
        ->withTimestamps();
    }
}
