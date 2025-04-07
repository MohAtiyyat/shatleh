<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coupon extends Model
{
    use SoftDeletes;

    protected $table = 'coupons';

    protected $fillable = [
        'amount',
        'title',
        'code',
        'is_active',
        'expire_date',
        'quantity',
        'country_id',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}
