<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'name_en',
        'name_ar',
        'description_en',
        'description_ar',
        'image',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'category_products', 'category_id', 'product_id')->as('category_products')->withTimestamps();
    }
}
