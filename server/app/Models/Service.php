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

    protected $casts = [
        'image' => 'array',
    ];
    public function getImageAttribute($value)
    {
        return json_decode($value);
    }



}
