<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $table = 'carts';

    protected $fillable = [
        'customer_id',
        'product_id',
        'ordered_at',
        'quantity',
    ];

    public function product()
    {
        return $this->hasMany(Product::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

}
