<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $table = 'countries';

    protected $fillable = [
        'name_en',
        'name_ar',
        'code',
    ];

    public $timestamps = false;

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function coupons()
    {
        return $this->hasMany(Coupon::class);
    }

}
