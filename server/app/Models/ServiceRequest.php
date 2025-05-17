<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    protected $fillable = [
        'service_id',
        'customer_id',
        'address_id',
        'details',
        'image',
        'employee_id',
        'expert_id',
        'status',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class);
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function expert()
    {
        return $this->belongsTo(User::class, 'expert_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class , 'address_id');
    }
}
