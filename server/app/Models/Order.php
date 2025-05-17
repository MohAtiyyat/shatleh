<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;
    protected $table = 'orders';
    protected $fillable = [
        'order_code',
        'address_id',
        'total_price',
        'customer_id',// store the user_id
        'employee_id',
        'coupon_id',
        'payment_id',
        'status',
        'cart_id',
        'delivery_cost',
        'delivery_date'
        ];

    public function customer()
    {
        return $this->belongsTo(User::class);
    }

    public function employee()
    {
        return $this->belongsTo(User::class);
    }

    public function address(){
        return $this->belongsTo(Address::class);
    }

    public function coupon(){
        return $this->belongsTo(Coupon::class);
    }

    public function payment(){
        return $this->belongsTo(PaymentInfo::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_details', 'order_id', 'product_id')
                    ->withPivot('price', 'quantity')
                    ->withTimestamps()
                    ->withTrashed();
    }

}
