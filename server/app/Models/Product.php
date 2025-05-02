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
        '`status`',
        'availability',
        'sold_quantity',
    ];

    protected $casts = [
        'image' => 'array',
    ];

    public function getImageAttribute($value)
    {
        return json_decode($value);
    }

    public function cart()
    {
        return $this->hasMany(Cart::class, 'product_id', 'id');
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_details', 'product_id', 'order_id')
            ->withPivot('price', 'quantity')
            ->withTimestamps()
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

    public function reviews()
    {
        return $this->hasMany(Review::class, 'product_id');
    }

    /**
     * Accessor for name as an object { en, ar }.
     */
    public function getNameAttribute(): array
    {
        return [
            'en' => $this->attributes['name_en'],
            'ar' => $this->attributes['name_ar'],
        ];
    }

    /**
     * Accessor for description as an object { en, ar }.
     */
    public function getDescriptionAttribute(): array
    {
        return [
            'en' => $this->attributes['description_en'] ?? '',
            'ar' => $this->attributes['description_ar'] ?? '',
        ];
    }

    /**
     * Accessor for inStock (alias for availability).
     */
    public function getInStockAttribute(): bool
    {
        return $this->attributes['availability'];
    }

    /**
     * Accessor for isTopSelling based on sold_quantity.
     */
    public function getIsTopSellingAttribute(): bool
    {
        return ($this->attributes['sold_quantity'] ?? 0) > 50;
    }
}