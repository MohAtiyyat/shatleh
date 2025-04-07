<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentInfo extends Model
{
    protected $table = 'payment_info';

    protected $fillable = [
        'card_type',
        'card_number',
        'cvv',
        'card_holder_name',
        
    ];

    public function customer(){
        return $this->belongsTo(Customer::class);
    }



}
