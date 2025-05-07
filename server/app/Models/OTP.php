<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OTP extends Model
{
    protected $table = "otp";
    protected $fillable = [
        'otp',
        'phone_number',
        'email',
        'expired_at'
    ];
    public $timestamps = true;
    protected $casts = [
        'expired_at' => 'datetime',
    ];
    public function isExpired()
    {
        return $this->expired_at < now();
    }
    public function isValid($otp)
    {
        return $this->otp == $otp && !$this->isExpired();
    }
}
