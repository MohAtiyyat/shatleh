<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use SoftDeletes;

    protected $table = 'payments';

    protected $fillable = [
        'order_id',
        'customer_id',
        'amount',
        'payment_info_id',
        'status',
        'refund_status'
    ];

    public function order(){
        return $this->belongsTo(Order::class);
    }

    public function customer(){
        return $this->belongsTo(Customer::class);
    }

    public function paymentInfo(){
        return $this->belongsTo(PaymentInfo::class);
    }
}
