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
        'customer_id',
        'employee_id',
        'assigned_to',
        'coupon_id',
        'status',
        'skipped_rating',
        'cart_id',
        'delivery_cost',
        'delivery_date',
        'payment_method', // Add payment_method to fillable
        'first_name',
        'last_name',
        'phone_number',
        'is_gift',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class);
    }

    public function employee()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_details', 'order_id', 'product_id')
                    ->withPivot('price', 'quantity')
                    ->withTimestamps()
                    ->withTrashed();
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id', 'id');
    }
    public function expert()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
