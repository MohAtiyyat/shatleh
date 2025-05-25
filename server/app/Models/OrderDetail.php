<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $table = 'order_details';

    protected $primaryKey = null;
    public $incrementing = false;

    protected $fillable = [
        'order_id',
        'product_id',
        'price',
        'quantity',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    protected $keyType = 'array';

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function getKey()
    {
        return [
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
        ];
    }
}