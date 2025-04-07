<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_code',
        'address_id',
        'total_price',
        'customer_id', 
        'employee_id',
        'coupon_id',
        'payment_id',
        'status',
        'cart_id', 
        'status', 
        'delivery_cost',
        'delivery_date'
        ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function employee()
    {
        return $this->belongsTo(User::class);
    }

    public function address(){
        return $this->belongsTo(Address::class);
    }

    public function coupon(){
        return $this->belongsTo(Coupons::class);
    }

    public function payment(){
        return $this->belongsTo(PaymentInfo::class);
    }

}
