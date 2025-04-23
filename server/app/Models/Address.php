<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    use SoftDeletes;

    protected $table = 'addresses';

    protected $fillable = [
        'title',
        'country_id',
        'city',
        'address_line',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function userDefult(){
        return $this->hasOne(User::class);
    }

    public function shop(){
        return $this->hasOne(Shop::class);
    }
}
