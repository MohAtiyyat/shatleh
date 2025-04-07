<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'services';

    protected $fillable = [
        'name_en',
        'name_ar',
        'image',
        'description_en',
        'description_ar',
        'status',
    ];

    public function service_requests()
    {
        return $this->hasMany(Customer::class ,'service_requests', 'service_id', 'customer_id')
            ->withpivot('address_id', 'details', 'image', 'employee_id', 'expert_id', 'status')
            ->as('service_requests')
            ->withTimestamps();
    }


}
