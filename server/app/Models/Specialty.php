<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    protected $table = 'specialties';

    protected $fillable = ['name_en', 'name_ar'];

    public function expert()
    {
        return $this->belongsToMany(User::class, 'expert_specialty', 'specialty_id', 'expert_id')
            ->withPivot('created_at', 'updated_at')
            ->withTimestamps();
    }
}
