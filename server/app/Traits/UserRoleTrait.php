<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait UserRoleTrait
{
    public function admin()
    {
        return (Auth::check() && Auth::user()->hasAnyRole('Admin', 'Expert', 'Employee'));
    }

}