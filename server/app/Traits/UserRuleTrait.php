<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait UserRuleTrait
{
    public function admin(): bool
    {
        return Auth::check() && Auth::user()->hasAnyRole('Admin', 'super-admin');
    }
}