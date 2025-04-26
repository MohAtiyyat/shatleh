<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

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
        'sold_quantity',
    ];

    protected $casts = [
        'image' => 'array',
    ];

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_details', 'product_id', 'order_id')
            ->withPivot('price', 'quantity')
            ->withTimestamps();
            ->withTrashed();
    }

    public function shops()
    {
        return $this->belongsToMany(Shop::class, 'product_shops', 'product_id', 'shop_id')
            ->withPivot('cost', 'employee_id')
            ->withTimestamps();
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_products', 'product_id', 'category_id')
            ->as('category_products')
            ->withTimestamps();
    }
}
