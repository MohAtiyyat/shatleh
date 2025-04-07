<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    protected $table = 'specialties';

    protected $fillable = ['name_en', 'name_ar'];

    public function user()
    {
        return $this->belongsToMany(User::class, 'expert_specialty', 'specialty_id', 'user_id')->as('specialty_experts')->withTimestamps();
    }
}
