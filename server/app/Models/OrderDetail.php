<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderDetail extends Model
{
    use SoftDeletes;

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
        'deleted_at',
        'created_at',
        'updated_at',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

   
    protected $keyType = 'array';

    public function getKey()
    {
        return [
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
        ];
    }
}