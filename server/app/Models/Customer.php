<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;
    
    protected $table = 'customers';

    protected $fillable = [
        'user_id',
        'balance',
        'payment_info_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function defultPaymentInfo()
    {
        return $this->belongsTo(PaymentInfo::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function address()
    {
        return $this->hasMany(Address::class);
    }

    public function defaultAddress(){
        return $this->belongsTo(Address::class, 'address_id');
    }

    public function paymentInfo(){
        return $this->hasMany(PaymentInfo::class);
    }
}
