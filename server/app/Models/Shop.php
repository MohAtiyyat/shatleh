<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    protected $table = 'shops';

    protected $fillable = [
        'address_id',
        'name',
        'details',
        'owner_phone_number',
        'owner_name',
        'is_partner',
        'image',
        'employee_id',
    ];

    public function products(){
        return $this->belongsToMany(Product::class, 'product_shops', 'shop_id','product_id')
        ->withPivot('cost', 'employee_id')
        ->withTimestamps();
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

}
